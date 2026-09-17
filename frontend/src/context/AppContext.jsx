import React, { createContext, useContext, useEffect, useState } from "react";
import { TECHNICAL_ARTICLES, UPCOMING_EVENTS } from "../data/mockData.js";
import { COURSES } from "../data/coursesData.js";
import { INTERNSHIPS } from "../data/internshipsData.js";
import { api } from "../lib/api.js";
import { authService } from "../lib/auth.js";
import { checkBackendHealth } from "../lib/backend.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);
  const [activePass, setActivePass] = useState(null);
  const [passesList, setPassesList] = useState([]);
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

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 4500);
  };

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    if (authService.hasToken()) {
      authService.me().then(setUser).catch(() => authService.logout());
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    api.myPassRequests().then((items) => {
      const mapped = items.map(mapPass);
      setPassesList(mapped);
      setActivePass(mapped.find((pass) => pass.passId) || null);
    }).catch(() => {});
    api.getMyPosts().then(setUserPosts).catch(() => {});
  }, [user]);

  const login = async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const loginWithGoogle = async () => {
    const authenticatedUser = await authService.loginWithGoogle();
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (credentials) => {
    const result = await authService.register(credentials);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActivePass(null);
    setPassesList([]);
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
    setPassModalOpen(false);
    showToast(mapped.passId ? "Pass issued successfully." : "Pass submitted for staff approval. QR access will appear after approval.");
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
    user, setUser, isLoggedIn, backendOnline, login, loginWithGoogle, register, logout, updateUserProfile,
    resetUserProfile: logout, userPosts, setUserPosts, userDrafts, setUserDrafts, createPost,
    deletePost: (id, draft) => draft ? setUserDrafts((items) => items.filter((item) => item.id !== id)) : setUserPosts((items) => items.filter((item) => item.id !== id)),
    notifications, setNotifications, markNotificationRead, markAllNotificationsRead,
    unreadNotificationCount: notifications.filter((item) => !item.read).length,
    savedPosts, setSavedPosts, toggleSavePost, activePass, setActivePass, passesList, registerPass,
    checkInPass, resetCheckIn, passModalOpen, setPassModalOpen, selectedPassType, setSelectedPassType,
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
    id: pass.id,
    passId: pass.pass_id,
    qrData: pass.qr_data,
    holder: pass.holder || `${pass.first_name || ""} ${pass.last_name || ""}`.trim(),
    email: pass.email,
    passType: String(pass.pass_type || "").toUpperCase(),
    price: pass.amount,
    organization: pass.company,
    role: pass.role,
    status: pass.status,
    expiresAt: pass.expires_at,
    validation: pass.status === "approved" ? "Issued" : "Pending approval",
  };
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
