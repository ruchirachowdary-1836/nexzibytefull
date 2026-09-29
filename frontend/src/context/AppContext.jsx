import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TECHNICAL_ARTICLES, UPCOMING_EVENTS } from "../data/mockData.js";
import { COURSES } from "../data/coursesData.js";
import { INTERNSHIPS } from "../data/internshipsData.js";
import { api, waitForRegistrationEmail } from "../lib/api.js";
import { authService } from "../lib/auth.js";
import { checkBackendHealth } from "../lib/backend.js";
import { visitorSecondsRemaining } from "../lib/visitor-session.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [activePass, setActivePass] = useState(null);
  const [passesList, setPassesList] = useState([]);
  const [registrationNotice, setRegistrationNotice] = useState(null);
  const [visitorTimeRemaining, setVisitorTimeRemaining] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userDrafts, setUserDrafts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [selectedPassType, setSelectedPassType] = useState("visitor-pass");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(TECHNICAL_ARTICLES[0]);
  const [summitModalOpen, setSummitModalOpen] = useState(false);
  const [selectedSummit, setSelectedSummit] = useState(UPCOMING_EVENTS[0]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [courseInitialTab, setCourseInitialTab] = useState("overview");
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(INTERNSHIPS[0]);
  const [internshipInitialTab, setInternshipInitialTab] = useState("overview");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 4500);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setActivePass(null);
    setPassesList([]);
    setVisitorTimeRemaining(null);
  }, []);

  useEffect(() => {
    checkBackendHealth().then((online) => {
      setBackendOnline(online);
      if (!online) showToast("The API is currently unavailable. Some features may not work.");
    });
    if (!authService.hasToken()) {
      setAuthReady(true);
      return;
    }
    {
      const hydrateSession = async () => {
        const googlePending = localStorage.getItem("techtalk-google-pending") === "1";
        let lastError;
        for (let attempt = 0; attempt < (googlePending ? 12 : 1); attempt += 1) {
          try {
            const authenticatedUser = await authService.me();
            setUser(authenticatedUser);
            if (googlePending) {
              localStorage.removeItem("techtalk-google-pending");
              window.location.hash = "/profile";
            }
            setAuthReady(true);
            return;
          } catch (error) {
            lastError = error;
            if (!googlePending || attempt === 11) break;
            await new Promise((resolve) => window.setTimeout(resolve, 750));
          }
        }
        if (googlePending) {
          showToast(`Google sign-in could not be completed: ${lastError?.message || "No active session was returned."}`);
          localStorage.removeItem("techtalk-google-pending");
        }
        authService.logout();
        setAuthReady(true);
      };
      hydrateSession();
    }
  }, [showToast]);

  useEffect(() => {
    if (!user?.visitor_access_only) {
      setVisitorTimeRemaining(null);
      return undefined;
    }
    let expired = false;
    const updateRemaining = () => {
      const remaining = visitorSecondsRemaining(user.visitor_expires_at);
      setVisitorTimeRemaining(remaining);
      if (remaining === 0 && !expired) {
        expired = true;
        logout();
        showToast("Your 10-minute visitor pass has expired. Please sign in again.");
      }
    };
    const handleExpiredSession = () => {
      if (expired) return;
      expired = true;
      logout();
      showToast("Your 10-minute visitor pass has expired. Please sign in again.");
    };
    updateRemaining();
    const timer = window.setInterval(updateRemaining, 250);
    window.addEventListener("focus", updateRemaining);
    window.addEventListener("visitor-session-expired", handleExpiredSession);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", updateRemaining);
      window.removeEventListener("visitor-session-expired", handleExpiredSession);
    };
  }, [user, logout, showToast]);

  useEffect(() => {
    if (!user) return;
    api.myPasses().then((items) => {
      const mapped = items.map(mapPass);
      setPassesList(mapped);
      setActivePass(mapped.find((pass) => pass.passId) || null);
    }).catch((error) => showToast(error.message || "Your passes could not be loaded."));
    api.getMyPosts().then(setUserPosts).catch((error) => showToast(error.message || "Your posts could not be loaded."));
  }, [user, showToast]);

  const updateRegistrationNotice = async (kind, registration, fallbackEmail, fallbackTitle) => {
    let saved = {
      kind,
      id: registration.id,
      email: registration.email || fallbackEmail || user?.email || "",
      title: registration.title || fallbackTitle || "your registration",
      email_delivery_status: registration.email_delivery_status || "queued",
    };
    try {
      const current = await waitForRegistrationEmail(kind, registration.id);
      const passes = await api.myPasses();
      const mapped = passes.map(mapPass);
      setPassesList(mapped);
      setActivePass(mapped.find((pass) => pass.passId) || null);
      if (current) {
        saved = {
          ...saved,
          email: current.email || saved.email,
          title: current.title || saved.title,
          email_delivery_status: current.email_delivery_status || saved.email_delivery_status,
        };
      }
    } catch {
      saved.email_delivery_status = "unknown";
    }
    setRegistrationNotice(saved);
    return saved;
  };

  const login = async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    if (authenticatedUser.verification_required) return authenticatedUser;
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const loginWithGoogle = async () => {
    // OAuth redirects away from the app. Session hydration after the callback
    // is responsible for loading the user and synchronizing the profile.
    await authService.loginWithGoogle();
    return null;
  };

  const register = async (credentials) => {
    const result = await authService.register(credentials);
    return result;
  };

  const hydrateCurrentUser = async (session = null) => {
    const authenticatedUser = await authService.me(session);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const activateVisitorPass = async (id) => {
    const response = await api.activateVisitorPass(id);
    const mapped = mapPass(response);
    setPassesList((current) => {
      const exists = current.some(
        (pass) => pass.kind === mapped.kind && pass.id === mapped.id,
      );
      return exists
        ? current.map((pass) => (
          pass.kind === mapped.kind && pass.id === mapped.id
            ? { ...pass, ...mapped }
            : pass
        ))
        : [mapped, ...current];
    });
    setUser((current) => current ? {
      ...current,
      visitor_access_only: true,
      visitor_activated_at: response.visitor_activated_at,
      visitor_expires_at: response.visitor_expires_at,
    } : current);
    return response;
  };

  const registerPass = async ({ attendeeName, email, passType, amount, notes, organization, role, phone, referralContact }) => {
    const response = await api.submitPassRequest({
      name: attendeeName,
      email,
      pass_type: passType,
      amount,
      company: organization,
      role,
      notes,
      phone,
      referral_contact: referralContact,
    });
    const mapped = mapPass(response);
    setPassesList((previous) => [mapped, ...previous.filter((pass) => pass.id !== mapped.id)]);
    setActivePass(mapped.passId ? mapped : null);
    await updateRegistrationNotice(
      "pass_request",
      { ...response, title: response.pass_type },
      response.email,
      response.pass_type,
    );
    setPassModalOpen(false);
    showToast("Your registration was saved. Check the confirmation message for delivery status.");
    return response;
  };

  const updateUserProfile = async (fields) => {
    const updated = await authService.updateProfile({
      name: fields.name,
      bio: fields.bio,
      location: fields.location,
      professional_role: fields.title || fields.role,
      profile_image: fields.avatar,
      website: fields.website,
      linkedin_url: fields.linkedin_url,
      github_url: fields.github_url,
      twitter_url: fields.twitter_url,
      devto_url: fields.devto_url,
      leetcode_url: fields.leetcode_url,
      instagram_url: fields.instagram_url,
    });
    setUser((current) => ({ ...updated, links: fields.links ?? updated.links ?? current?.links ?? [] }));
    showToast("Profile saved to your account.");
    return updated;
  };

  const createPost = async (payload) => {
    const categories = await api.getCategories();
    const categoryId = payload.categoryId || categories[0]?.id;
    if (!categoryId) throw new Error("No publishing category is available.");
    const post = await api.createPost({
      title: payload.title,
      content: payload.content,
      excerpt: payload.excerpt || payload.content?.slice(0, 160),
      category_id: categoryId,
      status: payload.status === "draft" ? "draft" : "published",
    });
    if (payload.status === "draft") setUserDrafts((items) => [post, ...items]);
    else setUserPosts((items) => [post, ...items]);
    showToast("Your dispatch was saved.");
    return post;
  };

  const checkInPass = (passId) => {
    const pass = passesList.find((item) => item.passId?.toLowerCase() === passId?.toLowerCase());
    if (!pass) {
      showToast("No matching issued pass was found.");
      return null;
    }
    showToast(`Pass ${passId} is ready for backend verification.`);
    return pass;
  };

  const resetCheckIn = () => {};
  const isLoggedIn = Boolean(user);
  const toggleSavePost = (post) => setSavedPosts((items) => items.some((item) => item.id === post.id) ? items.filter((item) => item.id !== post.id) : [post, ...items]);
  const markNotificationRead = (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
  const markAllNotificationsRead = () => setNotifications((items) => items.map((item) => ({ ...item, read: true })));

  const value = {
    user, setUser, isLoggedIn, authReady, backendOnline, login, loginWithGoogle, register, hydrateCurrentUser, logout, updateUserProfile,
    resetUserProfile: logout, userPosts, setUserPosts, userDrafts, setUserDrafts, createPost,
    deletePost: (id, draft) => draft ? setUserDrafts((items) => items.filter((item) => item.id !== id)) : setUserPosts((items) => items.filter((item) => item.id !== id)),
    notifications, setNotifications, markNotificationRead, markAllNotificationsRead,
    unreadNotificationCount: notifications.filter((item) => !item.read).length,
    savedPosts, setSavedPosts, toggleSavePost, activePass, setActivePass, passesList, registerPass,
    registrationNotice, setRegistrationNotice, updateRegistrationNotice,
    checkInPass, resetCheckIn, activateVisitorPass, visitorTimeRemaining, passModalOpen, setPassModalOpen, selectedPassType, setSelectedPassType,
    openPassModal: (type = "visitor-pass") => { setSelectedPassType(type); setPassModalOpen(true); },
    videoModalOpen, setVideoModalOpen, articleModalOpen, setArticleModalOpen, selectedArticle,
    openArticleReader: (article) => { setSelectedArticle(article); setArticleModalOpen(true); },
    summitModalOpen, setSummitModalOpen, selectedSummit, setSelectedSummit,
    openSummitModal: (summit) => { setSelectedSummit(summit); setSummitModalOpen(true); },
    courseModalOpen, setCourseModalOpen, selectedCourse, setSelectedCourse, courseInitialTab,
    setCourseInitialTab, openCourseModal: (course, tab = "overview") => { setSelectedCourse(course); setCourseInitialTab(tab); setCourseModalOpen(true); },
    internshipModalOpen, setInternshipModalOpen, selectedInternship, setSelectedInternship, internshipInitialTab,
    setInternshipInitialTab, openInternshipModal: (internship, tab = "overview") => { setSelectedInternship(internship); setInternshipInitialTab(tab); setInternshipModalOpen(true); },
    loginModalOpen, setLoginModalOpen, toastMessage, showToast, searchOpen, setSearchOpen, searchQuery, setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function mapPass(pass) {
  return {
    kind: pass.kind || "pass_request",
    id: pass.id,
    passId: pass.pass_id,
    qrData: pass.qr_data,
    qrImageDataUri: pass.qr_image_data_uri,
    holder: pass.holder || `${pass.first_name || ""} ${pass.last_name || ""}`.trim(),
    email: pass.email,
    passType: String(pass.pass_type || pass.title || pass.kind || "").toUpperCase(),
    price: pass.amount,
    organization: pass.company,
    role: pass.role,
    status: pass.status,
    expiresAt: pass.expires_at,
    emailDeliveryStatus: pass.email_delivery_status,
    event: pass.title || pass.pass_type,
    date: pass.date,
    time: pass.time,
    venue: pass.venue,
    title: pass.title,
    validation: ["approved", "issued"].includes(pass.status) ? "Issued" : "Pending approval",
  };
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
