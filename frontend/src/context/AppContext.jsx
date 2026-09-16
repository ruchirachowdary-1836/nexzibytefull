import React, { createContext, useContext, useState, useEffect } from "react";
import { SAMPLE_PASS, TECHNICAL_ARTICLES, PASSES, UPCOMING_EVENTS } from "../data/mockData.js";
import { COURSES } from "../data/coursesData.js";
import { INTERNSHIPS } from "../data/internshipsData.js";
import { DEFAULT_PROFILE, SAVED_POSTS_INITIAL, PUBLISHED_POSTS, DRAFT_POSTS_INITIAL, NOTIFICATIONS_INITIAL } from "../data/userProfileData.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Pass Management
  const [activePass, setActivePass] = useState(SAMPLE_PASS);
  const [passesList, setPassesList] = useState([SAMPLE_PASS]);
  
  // User Profile (Default: M. L. S. V. Aiswarya, Logged in by default)
  const [user, setUser] = useState({ ...DEFAULT_PROFILE, isLoggedIn: true });

  // User Posts & Drafts (In-Session)
  const [userPosts, setUserPosts] = useState(PUBLISHED_POSTS);
  const [userDrafts, setUserDrafts] = useState(DRAFT_POSTS_INITIAL);

  // Notifications (In-Session)
  const [notifications, setNotifications] = useState(NOTIFICATIONS_INITIAL);

  // Saved Posts / Bookmarks (In-Session)
  const [savedPosts, setSavedPosts] = useState(SAVED_POSTS_INITIAL);

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

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Register or Purchase a new Pass
  const registerPass = ({ attendeeName, email, passType, amount, notes, organization, role }) => {
    let resolvedType = "VISITOR PASS";
    let resolvedPrice = "FREE";
    let qrType = "VISITOR";
    let qrAmount = "FREE";
    let passBadge = "Community Visitor";

    if (passType === "student-pass" || passType === "STUDENT PASS") {
      resolvedType = "STUDENT PASS";
      resolvedPrice = amount || "₹99";
      qrType = "STUDENT";
      qrAmount = "99";
      passBadge = "Student & Researcher";
    } else if (passType === "founder-pass" || passType === "FOUNDER PASS") {
      resolvedType = "FOUNDER PASS";
      resolvedPrice = amount || "₹499";
      qrType = "FOUNDER";
      qrAmount = "499";
      passBadge = "Founder & CXO";
    } else if (passType === "delegation-pass" || passType === "DELEGATION PASS" || passType === "delegate-pass" || passType === "DELEGATE PASS") {
      resolvedType = "DELEGATION PASS";
      resolvedPrice = amount || "₹250";
      qrType = "DELEGATE";
      qrAmount = "250";
      passBadge = "Corporate Delegate";
    } else {
      resolvedType = "VISITOR PASS";
      resolvedPrice = "FREE";
      qrType = "VISITOR";
      qrAmount = "FREE";
      passBadge = "Visitor";
    }

    const newPassId = `TT26-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`;
    
    const newPass = {
      org: "NEXZIBYTE",
      event: "TECHTALK 2026",
      passType: resolvedType,
      price: resolvedPrice,
      holder: attendeeName.toUpperCase(),
      email: email,
      organization: organization || "",
      role: role || "",
      passId: newPassId,
      badge: passBadge,
      validation: "VALID FOR EVENT ENTRY",
      status: "Verified",
      checkedIn: false,
      checkInTime: null,
      notes: notes || "",
      tags: ["Secure", "Unique", "Contactless", passBadge],
      qrData: `TECHTALK:${newPassId}:${attendeeName.toUpperCase()}:${qrType}:${qrAmount}:VERIFIED`
    };

    setActivePass(newPass);
    setPassesList((prev) => [newPass, ...prev]);
    setPassModalOpen(false);

    showToast(
      `🎟️ Success! ${resolvedType} ${newPassId} generated for ${attendeeName} (${resolvedPrice}).`
    );

    return newPass;
  };

  // Check In an Attendee via QR scanner or button
  const checkInPass = (passId) => {
    let updated = null;
    const matchId = (pId, target) => {
      if (!pId || !target) return false;
      const a = pId.toLowerCase().trim();
      const b = target.toLowerCase().trim();
      return a === b || a.endsWith(b) || b.endsWith(a.replace("tt26-", ""));
    };

    setPassesList((prev) =>
      prev.map((p) => {
        if (matchId(p.passId, passId)) {
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

    if (matchId(activePass.passId, passId)) {
      setActivePass((prev) => ({
        ...prev,
        checkedIn: true,
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }

    showToast(`✓ Check-in verified for Pass ${passId}! Welcome to TechTalk 2026.`);
  };

  // Reset Check-in Status
  const resetCheckIn = (passId) => {
    const matchId = (pId, target) => {
      if (!pId || !target) return false;
      const a = pId.toLowerCase().trim();
      const b = target.toLowerCase().trim();
      return a === b || a.endsWith(b) || b.endsWith(a.replace("tt26-", ""));
    };

    setPassesList((prev) =>
      prev.map((p) => (matchId(p.passId, passId) ? { ...p, checkedIn: false, checkInTime: null } : p))
    );
    if (matchId(activePass.passId, passId)) {
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

  // In-Session Profile Update (Temporary / In-Memory only)
  const updateUserProfile = (newFields) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        ...newFields,
        // Auto update initials if name changed
        avatarInitials: newFields.name 
          ? newFields.name.split(" ").filter(Boolean).map(n => n[0]).slice(0, 2).join("").toUpperCase()
          : prev.avatarInitials
      };
      return updated;
    });
    showToast(`✓ Profile updated for this session. (Temporary / In-memory)`);
  };

  // Reset to default profile (M. L. S. V. Aiswarya)
  const resetUserProfile = () => {
    setUser({ ...DEFAULT_PROFILE, isLoggedIn: true });
    showToast(`✓ Profile reset to default (M. L. S. V. Aiswarya).`);
  };

  // Auth Session Helpers (Login & Logout)
  const logout = () => {
    setUser((prev) => ({
      ...(prev || DEFAULT_PROFILE),
      isLoggedIn: false
    }));
    showToast("👋 You have been logged out of TechTalk successfully.");
  };

  const login = (credentials = {}) => {
    setUser((prev) => ({
      ...(prev || DEFAULT_PROFILE),
      ...credentials,
      isLoggedIn: true
    }));
    showToast(`✓ Welcome back, ${credentials.name || user?.name || "Member"}!`);
  };

  const isLoggedIn = Boolean(user && user.isLoggedIn !== false);

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

  // Create a new post or save draft
  const createPost = ({ title, category, excerpt, content, tags, coverImage, status = "published" }) => {
    const newId = `post-${Date.now()}`;
    const dateFormatted = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const words = (content || "").trim().split(/\s+/).length;
    const readingTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

    const newPostObj = {
      id: newId,
      title,
      category: category || "GENERAL TECH",
      author: user?.name || "M. L. S. V. Aiswarya",
      role: user?.role || "Senior Full Stack Developer",
      date: dateFormatted,
      lastModified: dateFormatted,
      readingTime,
      views: "1",
      likes: 0,
      excerpt: excerpt || content?.slice(0, 140) + "...",
      content,
      tags: tags && tags.length > 0 ? tags : ["TechTalk", category || "Architecture"],
      coverImage: coverImage || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
      status: status === "draft" ? "Draft" : "Published",
      progress: status === "draft" ? 60 : 100
    };

    if (status === "draft") {
      setUserDrafts((prev) => [newPostObj, ...prev]);
      showToast(`📝 Draft "${title.slice(0, 28)}..." saved successfully.`);
    } else {
      setUserPosts((prev) => [newPostObj, ...prev]);
      showToast(`🚀 Technical dispatch "${title.slice(0, 28)}..." published successfully!`);
    }

    return newPostObj;
  };

  // Delete a post or draft
  const deletePost = (postId, isDraft = false) => {
    if (isDraft) {
      setUserDrafts((prev) => prev.filter((d) => d.id !== postId));
      showToast("Draft deleted from your workspace.");
    } else {
      setUserPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast("Published dispatch removed.");
    }
  };

  // Mark notification read
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  // Mark all notifications read
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("✓ All notifications marked as read.");
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        login,
        logout,
        updateUserProfile,
        resetUserProfile,
        userPosts,
        setUserPosts,
        userDrafts,
        setUserDrafts,
        createPost,
        deletePost,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationCount,
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
