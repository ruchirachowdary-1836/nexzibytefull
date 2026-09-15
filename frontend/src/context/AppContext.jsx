import React, { createContext, useContext, useState, useEffect } from "react";
import { TECHNICAL_ARTICLES, UPCOMING_EVENTS } from "../data/mockData.js";
import { COURSES } from "../data/coursesData.js";
import { INTERNSHIPS } from "../data/internshipsData.js";
import { checkBackendHealth } from "../lib/backend.js";
import { authService } from "../lib/auth.js";
import { api } from "../lib/api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Pass Management
  const [activePass, setActivePass] = useState(null);
  const [passesList, setPassesList] = useState([]);
  
  // Profile data is loaded only from the authenticated backend user.
  const [user, setUser] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);

  // Saved Posts / Bookmarks (In-Session)
  const [savedPosts, setSavedPosts] = useState([]);

  // UI Modals & State
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

  useEffect(() => {
    let active = true;
    checkBackendHealth().then((online) => {
      if (active) setBackendOnline(online);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authService.hasToken()) return;
    authService.me().then(setUser).catch(() => authService.logout());
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const login = async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (credentials) => {
    const authenticatedUser = await authService.register(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Register or Purchase a new Pass
  const registerPass = async ({ attendeeName, email, passType, amount, company, role, notes }) => {
    const response = await api.submitPassRequest({
      name: attendeeName,
      email,
      pass_type: passType,
      amount,
      company,
      role,
      notes,
    });
    const isVisitor = passType === "visitor-pass" || passType === "VISITOR PASS";
    setActivePass({
      passId: response.pass_id,
      qrData: response.qr_data,
      holder: response.holder,
      passType: response.pass_type === "visitor-pass" ? "VISITOR PASS" : "DELEGATE PASS",
      price: response.amount,
      organization: response.company,
      role: response.role,
      event: "NexziByte TechTalk",
      org: "NexziByte TechTalk",
      validation: "Issued",
      checkedIn: false,
    });
    setPassModalOpen(false);

    showToast(
      isVisitor
        ? `Visitor pass request submitted for ${attendeeName}.`
        : `Delegate pass request submitted for ${attendeeName}.`
    );

    return response;
  };

  // Check In an Attendee via QR scanner or button
  const checkInPass = (passId) => {
    if (!passId || !activePass?.passId) {
      showToast("No issued pass is available for check-in.");
      return null;
    }
    let updated = null;
    setPassesList((prev) =>
      prev.map((p) => {
        if (p.passId.toLowerCase() === passId.toLowerCase()) {
          updated = {
            ...p,
            checkedIn: true,
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return updated;
        }
        return p;
      })
    );

    if (activePass.passId.toLowerCase() === passId.toLowerCase()) {
      setActivePass((prev) => ({
        ...prev,
        checkedIn: true,
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }

    showToast(`✓ Check-in verified for Pass ${passId}! Welcome to TechTalk 2026.`);
    return updated || activePass;
  };

  // Quick reset check-in status (for testing scanner toggle)
  const resetCheckIn = (passId) => {
    if (!passId || !activePass?.passId) return;
    setPassesList((prev) =>
      prev.map((p) => (p.passId.toLowerCase() === passId.toLowerCase() ? { ...p, checkedIn: false, checkInTime: null } : p))
    );
    if (activePass.passId.toLowerCase() === passId.toLowerCase()) {
      setActivePass((prev) => ({ ...prev, checkedIn: false, checkInTime: null }));
    }
    showToast(`Status reset for Pass ${passId}. Ready for scan.`);
  };

  // Open Pass Modal with preset type
  const openPassModal = (type = "visitor-pass") => {
    setSelectedPassType(type);
    setPassModalOpen(true);
  };

  // Open Article Reader
  const openArticleReader = (article) => {
    setSelectedArticle(article);
    setArticleModalOpen(true);
  };

  // Open Summit / Milestone Details Modal
  const openSummitModal = (summit) => {
    setSelectedSummit(summit);
    setSummitModalOpen(true);
  };

  // Open Course Details & Application Modal
  const openCourseModal = (course, initialTab = "overview") => {
    setSelectedCourse(course);
    setCourseInitialTab(initialTab);
    setCourseModalOpen(true);
  };

  // Open Internship Details & Application Modal
  const openInternshipModal = (internship, initialTab = "overview") => {
    setSelectedInternship(internship);
    setInternshipInitialTab(initialTab);
    setInternshipModalOpen(true);
  };

  // Persist profile changes through the authenticated backend account.
  const updateUserProfile = (newFields) => {
    return authService.updateProfile({
      name: newFields.name,
      email: newFields.email,
      bio: newFields.bio,
      location: newFields.location,
      professional_role: newFields.title || newFields.role,
      profile_image: newFields.avatar,
      website: newFields.website,
      linkedin_url: newFields.linkedin_url,
      github_url: newFields.github_url,
      twitter_url: newFields.twitter_url,
      devto_url: newFields.devto_url,
    }).then((updatedUser) => {
      setUser(updatedUser);
      showToast("Profile saved to your Nexzibyte account.");
      return updatedUser;
    });
  };

  const resetUserProfile = () => {
    logout();
    showToast("Signed out of Nexzibyte TechTalk.");
  };

  // Toggle Save / Bookmark Post
  const toggleSavePost = (post) => {
    setSavedPosts((prev) => {
      const exists = prev.some((p) => p.id === post.id);
      if (exists) {
        showToast(`Article removed from saved posts.`);
        return prev.filter((p) => p.id !== post.id);
      } else {
        showToast(`Article bookmarked to your saved posts!`);
        return [{ ...post, savedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }, ...prev];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        backendOnline,
        setUser,
        updateUserProfile: async (newFields) => {
          const updated = await authService.updateProfile({
            name: newFields.name,
            email: newFields.email,
            bio: newFields.bio,
            location: newFields.location,
            professional_role: newFields.role || newFields.title,
            profile_image: newFields.avatar,
            website: newFields.website,
            linkedin_url: newFields.linkedin_url,
            github_url: newFields.github_url,
            twitter_url: newFields.twitter_url,
            devto_url: newFields.devto_url
          });
          setUser(updated);
          showToast("Profile saved to your account.");
          return updated;
        },
        resetUserProfile,
        savedPosts,
        setSavedPosts,
        toggleSavePost,
        activePass,
        setActivePass,
        passesList,
        registerPass,
        checkInPass,
        resetCheckIn,
        passModalOpen,
        setPassModalOpen,
        selectedPassType,
        setSelectedPassType,
        openPassModal,
        videoModalOpen,
        setVideoModalOpen,
        articleModalOpen,
        setArticleModalOpen,
        selectedArticle,
        openArticleReader,
        summitModalOpen,
        setSummitModalOpen,
        selectedSummit,
        setSelectedSummit,
        openSummitModal,
        courseModalOpen,
        setCourseModalOpen,
        selectedCourse,
        setSelectedCourse,
        courseInitialTab,
        setCourseInitialTab,
        openCourseModal,
        internshipModalOpen,
        setInternshipModalOpen,
        selectedInternship,
        setSelectedInternship,
        internshipInitialTab,
        setInternshipInitialTab,
        openInternshipModal,
        loginModalOpen,
        setLoginModalOpen,
        toastMessage,
        showToast,
        searchOpen,
        setSearchOpen,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
