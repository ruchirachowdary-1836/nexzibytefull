import React, { createContext, useContext, useState, useEffect } from "react";
import { SAMPLE_PASS, TECHNICAL_ARTICLES, PASSES, UPCOMING_EVENTS } from "../data/mockData.js";
import { COURSES } from "../data/coursesData.js";
import { INTERNSHIPS } from "../data/internshipsData.js";
import { DEFAULT_PROFILE, SAVED_POSTS_INITIAL } from "../data/userProfileData.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Pass Management
  const [activePass, setActivePass] = useState(SAMPLE_PASS);
  const [passesList, setPassesList] = useState([SAMPLE_PASS]);
  
  // User Profile (Default: M. L. S. V. Aiswarya)
  const [user, setUser] = useState(DEFAULT_PROFILE);

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
  const registerPass = ({ attendeeName, email, passType, amount, notes }) => {
    const isVisitor = passType === "visitor-pass" || passType === "VISITOR PASS";
    const newPassId = `TT26-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`;
    
    const newPass = {
      org: "NEXZIBYTE",
      event: "TECHTALK 2026",
      passType: isVisitor ? "VISITOR PASS" : "DELEGATE PASS",
      price: isVisitor ? "FREE" : "₹250",
      holder: attendeeName.toUpperCase(),
      email: email,
      passId: newPassId,
      validation: "VALID FOR EVENT ENTRY",
      status: "Verified",
      checkedIn: false,
      checkInTime: null,
      notes: notes || "",
      tags: ["Secure", "Unique", "Contactless"],
      qrData: `TECHTALK:${newPassId}:${attendeeName.toUpperCase()}:${isVisitor ? "VISITOR" : "DELEGATE"}:${isVisitor ? "FREE" : "250"}:VERIFIED`
    };

    setActivePass(newPass);
    setPassesList((prev) => [newPass, ...prev]);
    setPassModalOpen(false);

    showToast(
      isVisitor
        ? `🎟️ Success! Free Visitor Pass ${newPassId} generated for ${attendeeName}.`
        : `🎟️ Success! Delegate Pass ${newPassId} generated for ${attendeeName} (₹250).`
    );

    return newPass;
  };

  // Check In an Attendee via QR scanner or button
  const checkInPass = (passId) => {
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
    setUser(DEFAULT_PROFILE);
    showToast(`✓ Profile reset to default (M. L. S. V. Aiswarya).`);
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
        setUser,
        updateUserProfile,
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
