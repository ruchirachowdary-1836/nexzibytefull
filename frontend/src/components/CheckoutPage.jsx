import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import { 
  Check, CheckCircle2, ShieldCheck, Lock, CreditCard, ArrowLeft, 
  ChevronDown, ChevronUp, Sparkles, GraduationCap, Briefcase, Building, 
  Ticket, QrCode, Download, Copy, Tag, HelpCircle, Info, Smartphone, 
  Landmark, AlertCircle, FileText
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PASSES } from "../data/mockData.js";
import { PassQRCodeSVG } from "./DigitalPass.jsx";

// Popular Indian Banks Data for Net Banking
const POPULAR_INDIAN_BANKS = [
  { id: "sbi", name: "State Bank of India", short: "SBI", code: "SBIN", color: "#280071", badge: "Govt / Public" },
  { id: "hdfc", name: "HDFC Bank", short: "HDFC", code: "HDFC", color: "#004c8f", badge: "Most Popular" },
  { id: "icici", name: "ICICI Bank", short: "ICICI", code: "ICIC", color: "#b02a30", badge: "Fast Checkout" },
  { id: "axis", name: "Axis Bank", short: "Axis", code: "UTIB", color: "#97144d", badge: "Top 4" },
  { id: "kotak", name: "Kotak Mahindra Bank", short: "Kotak", code: "KKBK", color: "#ed1b24", badge: "Private" },
  { id: "pnb", name: "Punjab National Bank", short: "PNB", code: "PUNB", color: "#a21d22", badge: "Public Sector" },
];

const ALL_INDIAN_BANKS = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank (PNB)",
  "Bank of Baroda",
  "Canara Bank",
  "IndusInd Bank",
  "Yes Bank",
  "Union Bank of India",
  "Federal Bank",
  "IDBI Bank",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "IDFC FIRST Bank",
  "RBL Bank",
  "AU Small Finance Bank",
  "Bandhan Bank",
  "Jammu & Kashmir Bank",
  "South Indian Bank",
  "Karur Vysya Bank",
  "City Union Bank",
  "UCO Bank",
  "Punjab & Sind Bank",
  "Indian Overseas Bank",
  "Bank of Maharashtra",
  "Karnataka Bank",
  "Dhanlaxmi Bank",
  "Saraswat Co-operative Bank"
];

const INDIAN_STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Maharashtra",
  "Delhi NCR",
  "Tamil Nadu",
  "Gujarat",
  "Uttar Pradesh",
  "West Bengal",
  "Kerala",
  "Rajasthan",
  "Madhya Pradesh",
  "Punjab",
  "Haryana",
  "Bihar",
  "Odisha",
  "Assam",
  "Goa",
  "Chandigarh",
  "Uttarakhand",
  "Jharkhand",
  "Himachal Pradesh"
];

// Curated Benefits Breakdown for Student, Founder & Delegation Passes
const PASS_DETAILS = {
  "student-pass": {
    id: "student-pass",
    type: "Student Pass",
    badge: "Student & Researcher",
    basePrice: 99,
    originalPrice: 499,
    discountTag: "80% Subsidized",
    accentColor: "#059669",
    icon: GraduationCap,
    heroTitle: "Student Tech Accreditation Program",
    summary: "Feeling unsure about breaking into high-growth software engineering and securing top tech internships?",
    subSummary: "You're not alone. The hiring market today demands far more than submitting generic resumes. From production system architectures and GitHub codebases to technical interview readiness — navigating it alone can feel intimidating. That's where the TechTalk Student Accreditation Pass comes in.",
    closingNote: "Ready to launch your engineering career and build production systems? Join the TechTalk Student Community today and fast-track your path to top tech roles.",
    features: [
      {
        title: "1:1 Engineering Mentorship Session",
        desc: "Kick off with a dedicated 1-on-1 strategy session with a senior tech architect to clarify your career goals, review your roadmap, and build a personalized action plan tailored to you."
      },
      {
        title: "CV & GitHub Portfolio Review",
        desc: "We will review and enhance your technical resume and GitHub repositories to showcase your high-impact projects and make you stand out to campus tech recruiters."
      },
      {
        title: "Hands-on Architecture Lab & Sandbox Access",
        desc: "Get full access to live coding workshops, distributed systems teardowns, cloud sandboxes, and AI/ML model deployment labs."
      },
      {
        title: "Campus Recruiter & Internship Matchmaking Pool",
        desc: "Direct access to NexziByte's 23 specialized internship tracks and active placement pipelines across partner tech companies."
      },
      {
        title: "Digital Certificate of Participation",
        desc: "Official cryptographically verifiable student accreditation certificate to highlight on LinkedIn, GitHub, and academic portfolios."
      },
      {
        title: "1 Month All-Access to TechTalk Student Community",
        desc: "Join our private Discord & Slack groups of ambitious student engineers for peer support, weekly problem-solving huddles, and hackathon teams."
      }
    ]
  },
  "founder-pass": {
    id: "founder-pass",
    type: "Founder VIP Pass",
    badge: "Founder & CXO Circle",
    basePrice: 499,
    originalPrice: 1999,
    discountTag: "75% Launch Offer",
    accentColor: "#D97706",
    icon: Briefcase,
    heroTitle: "Founder & CXO VIP Accreditation",
    summary: "Navigating the venture journey alone, struggling to secure enterprise pilots, or looking for high-signal investors?",
    subSummary: "Building an enduring technology venture takes more than just pitching. From finding early enterprise design partners to investor syndicates and navigating early-stage hiring — having a confidential peer circle makes all the difference. That's why we created the TechTalk Founder VIP Circle.",
    closingNote: "Ready to accelerate your startup trajectory and connect with authentic peer builders? Secure your Founder VIP Pass today.",
    features: [
      {
        title: "VIP Entry to Closed-Door Founder Meets & Circles",
        desc: "Exclusive access to private founder summits and intimate breakout masterclasses with proven venture-backed entrepreneurs."
      },
      {
        title: "Chatham House Founder Roundtables",
        desc: "Unvarnished, confidential discussions on scaling hurdles, unit economics, go-to-market strategies, and founder resilience — strictly no vanity pitches."
      },
      {
        title: "1-on-1 Angel Syndicate & Investor Matchmaking",
        desc: "Curated introductions with active angel investors, family offices, and seed funds looking for promising tech startups."
      },
      {
        title: "Enterprise POC Discovery & Design Partner Sessions",
        desc: "Direct access to enterprise decision-makers and CTOs seeking modern software pilot implementations."
      },
      {
        title: "Access to NexziByte Founder Alumni Lounge",
        desc: "Private lounge access at all physical summits with complimentary barista service, private meeting pods, and high-speed Wi-Fi."
      },
      {
        title: "Verified Digital Founder VIP Credential & Directory",
        desc: "Verified VIP accreditation and a featured profile in the official TechTalk Venture Showcase directory."
      }
    ]
  },
  "delegation-pass": {
    id: "delegation-pass",
    type: "Corporate Delegation Pass",
    badge: "Corporate Delegate",
    basePrice: 250,
    originalPrice: 999,
    discountTag: "Corporate Tier",
    accentColor: "#E11D48",
    icon: Building,
    heroTitle: "Corporate Enterprise Delegation Pass",
    summary: "Equipping your engineering and leadership teams with cutting-edge architectures and cloud-native practices?",
    subSummary: "Modern enterprise infrastructure is evolving at breakneck speed. From generative AI in production to resilient microservices and distributed data platforms — keeping your engineering teams ahead of the curve is crucial. TechTalk Corporate Delegation Passes provide comprehensive all-access accreditation.",
    closingNote: "Empower your engineering leaders with actionable insights from industry fellows and system architects. Reserve your delegation accreditation today.",
    features: [
      {
        title: "All-Access Corporate Summit & Masterclass Entry",
        desc: "Full accreditation to all keynote sessions, architecture teardowns, deep-dive panels, and enterprise technical tracks."
      },
      {
        title: "Executive & Speaker Q&A Roundtables",
        desc: "Direct access to keynote speakers, principal engineers, and distinguished fellows during private VIP Q&A breakout sessions."
      },
      {
        title: "VIP Corporate Networking & Partner Lounges",
        desc: "Connect with peer technology leaders, VP of Engineering, CTOs, and solution architects across Fortune 500 & scale-up firms."
      },
      {
        title: "Official Physical & Digital Event Masterclass Kit",
        desc: "Comprehensive conference archive including slide decks, architecture blueprints, benchmarking reports, and session recordings."
      },
      {
        title: "Priority Seating & Fast-Track Check-In",
        desc: "Dedicated VIP registration desks and priority seating in all auditorium sessions and keynote stages."
      },
      {
        title: "Official GST-Compliant Corporate Tax Invoicing",
        desc: "Instant GST invoice generation with input tax credit (ITC) eligibility for corporate accounting and tax compliance."
      }
    ]
  }
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const { passId: routePassId } = useParams();
  const navigate = useNavigate();
  const { registerPass, showToast, activePass } = useApp();

  // Determine initial selected pass
  const queryPass = searchParams.get("pass") || routePassId || "student-pass";
  const normalizedPass = (queryPass === "founder-pass" || queryPass === "founder") 
    ? "founder-pass" 
    : (queryPass === "delegation-pass" || queryPass === "delegate-pass" || queryPass === "delegation")
    ? "delegation-pass" 
    : "student-pass";

  const [selectedPass, setSelectedPass] = useState(normalizedPass);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Form Fields (Right Column)
  const { user } = useApp();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState(user?.name || "");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [studentDegree, setStudentDegree] = useState("");
  const [ventureStage, setVentureStage] = useState("");

  // Payment Method Selection: "bank" | "upi" | "card"
  const [paymentMethod, setPaymentMethod] = useState("bank");

  // Net Banking specific fields
  const [selectedBank, setSelectedBank] = useState("hdfc");
  const [customBank, setCustomBank] = useState("");
  const [accountHolderName, setAccountHolderName] = useState(user?.name || "");

  // UPI specific fields
  const [upiMethod, setUpiMethod] = useState("id"); // "id" | "qr"
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");

  // Card specific fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState(user?.name || "");

  // Tax / GSTIN
  const [showTaxId, setShowTaxId] = useState(false);
  const [taxId, setTaxId] = useState("");

  // Agreement
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Coupon Code logic
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Processing & Confirmation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedPassData, setCompletedPassData] = useState(null);
  const [transactionRef, setTransactionRef] = useState("");

  // Update selected pass if query param changes
  useEffect(() => {
    if (queryPass && PASS_DETAILS[normalizedPass]) {
      setSelectedPass(normalizedPass);
    }
  }, [queryPass, normalizedPass]);

  const activePassConfig = PASS_DETAILS[selectedPass] || PASS_DETAILS["student-pass"];

  // Pricing calculations (in INR ₹)
  const baseAmount = activePassConfig.basePrice;
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round((baseAmount * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "flat") {
      discountAmount = Math.min(appliedCoupon.value, baseAmount);
    }
  }

  const subtotalAfterDiscount = Math.max(0, baseAmount - discountAmount);
  // 18% GST (Standard Indian Goods & Services Tax)
  const gstRate = 0.18;
  const gstAmount = Math.round(subtotalAfterDiscount * gstRate);
  const totalAmount = subtotalAfterDiscount + gstAmount;

  // Handle Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "TECHTALK20" || code === "TECH20") {
      setAppliedCoupon({ code, type: "percent", value: 20, desc: "20% Discount applied" });
      setCouponSuccess("🎉 20% discount code applied successfully!");
    } else if (code === "STUDENT50") {
      setAppliedCoupon({ code, type: "flat", value: 50, desc: "₹50 Student Special Off" });
      setCouponSuccess("🎉 ₹50 Student Special discount applied!");
    } else if (code === "FOUNDER100") {
      setAppliedCoupon({ code, type: "flat", value: 100, desc: "₹100 Founder Circle Off" });
      setCouponSuccess("🎉 ₹100 Founder Circle discount applied!");
    } else if (code === "NEXZIBYTE") {
      setAppliedCoupon({ code, type: "percent", value: 30, desc: "30% NexziByte Ecosystem discount" });
      setCouponSuccess("🎉 30% Partner discount applied!");
    } else {
      setCouponError("Invalid coupon code. Try TECHTALK20 or STUDENT50");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Handle Payment Submission
  const handlePay = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    if (!email || !fullName) {
      showToast("Please provide your email and full name.");
      return;
    }

    setIsProcessing(true);

    const generatedTxn = `TXN-IN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTransactionRef(generatedTxn);

    setTimeout(() => {
      // Determine payment method label
      let methodLabel = "Net Banking (Indian Bank)";
      let bankResolved = "";
      if (paymentMethod === "bank") {
        const found = POPULAR_INDIAN_BANKS.find(b => b.id === selectedBank);
        bankResolved = found ? found.name : (customBank || "Indian Scheduled Bank");
        methodLabel = `Net Banking - ${bankResolved}`;
      } else if (paymentMethod === "upi") {
        methodLabel = `UPI (${upiId || selectedUpiApp.toUpperCase()})`;
      } else {
        methodLabel = `Card (RuPay / Visa ending in ${cardNumber.slice(-4) || "4410"})`;
      }

      const orgField = selectedPass === "student-pass" 
        ? organization 
        : (selectedPass === "founder-pass" ? organization : organization);

      const roleField = selectedPass === "student-pass" 
        ? `${studentDegree} • Student` 
        : (selectedPass === "founder-pass" ? `${role} (${ventureStage})` : role);

      const passCreated = registerPass({
        attendeeName: fullName,
        email,
        passType: selectedPass,
        amount: `₹${totalAmount}`,
        organization: orgField,
        role: roleField,
        notes: `Paid via ${methodLabel} | Txn: ${generatedTxn} | GSTIN: ${taxId || "B2C Consumer"}`
      });

      setCompletedPassData({
        ...passCreated,
        paymentMethod: methodLabel,
        txnId: generatedTxn,
        totalPaid: totalAmount,
        basePrice: baseAmount,
        gst: gstAmount,
        discount: discountAmount,
        taxId: taxId || "N/A"
      });

      setIsProcessing(false);
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  return (
    <div className="checkout-page-wrapper">
      {/* Top Header Bar with TechTalk Brand */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link to="/passes" className="checkout-brand-link" title="Return to Passes">
            <div className="checkout-text-brand-wrap">
              <span className="brand-tech-text">Tech</span>
              <span className="brand-talk-text">Talk</span>
            </div>
            <span className="checkout-brand-badge">SECURE CHECKOUT 🇮🇳</span>
          </Link>

          <div className="checkout-header-right">
            <Link to="/passes" className="checkout-back-link">
              <ArrowLeft size={16} />
              <span>Back to Passes</span>
            </Link>
            <div className="checkout-badge-security">
              <ShieldCheck size={14} style={{ color: "#059669" }} />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="checkout-main">
        {isCompleted ? (
          /* Post-Payment Confirmed View */
          <div className="checkout-success-view">
            <div className="checkout-success-card">
              <div className="success-icon-badge">
                <CheckCircle2 size={44} style={{ color: "#059669" }} />
              </div>
              <span className="success-tag">PAYMENT CONFIRMED • OFFICIAL PASS ISSUED</span>
              <h1 className="success-title">Welcome to TechTalk 2026!</h1>
              <p className="success-subtitle">
                Your payment of <strong>₹{completedPassData?.totalPaid} INR</strong> was processed successfully. 
                Your digital badge and cryptographic pass are ready.
              </p>

              <div className="success-details-box">
                <div className="success-detail-row">
                  <span className="detail-label">Transaction Reference:</span>
                  <span className="detail-value mono-code">{completedPassData?.txnId}</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Pass Category:</span>
                  <span className="detail-value">{activePassConfig.type} ({activePassConfig.badge})</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Attendee Name:</span>
                  <span className="detail-value">{completedPassData?.holder}</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Email Address:</span>
                  <span className="detail-value">{completedPassData?.email}</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Payment Mode:</span>
                  <span className="detail-value">{completedPassData?.paymentMethod}</span>
                </div>
                <div className="success-detail-row">
                  <span className="detail-label">Pass ID:</span>
                  <span className="detail-value pass-id-pill">{completedPassData?.passId}</span>
                </div>
              </div>

              {/* Pass Ticket Preview */}
              <div className="success-ticket-preview">
                <div className="ticket-preview-header" style={{ background: activePassConfig.accentColor }}>
                  <span>NEXZIBYTE TECHTALK 2026</span>
                  <span>{activePassConfig.type}</span>
                </div>
                <div className="ticket-preview-body">
                  <div className="ticket-preview-info">
                    <div className="ticket-holder-name">{completedPassData?.holder}</div>
                    <div className="ticket-holder-role">{completedPassData?.role || "Accredited Attendee"}</div>
                    <div className="ticket-org-name">{completedPassData?.organization || "NexziByte Community"}</div>
                    <div className="ticket-status-pill">
                      <Check size={12} />
                      <span>{completedPassData?.validation || "VALID FOR EVENT ENTRY"}</span>
                    </div>
                  </div>
                  <div className="ticket-preview-qr">
                    <PassQRCodeSVG value={completedPassData?.qrData || "TECHTALK:PASS"} size={90} />
                    <span className="qr-caption">{completedPassData?.passId}</span>
                  </div>
                </div>
              </div>

              <div className="success-actions-row">
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    showToast(`Downloading digital ticket for ${completedPassData?.holder}...`);
                  }}
                >
                  <Download size={17} />
                  <span>Download Pass (PDF)</span>
                </button>

                <Link to="/passes" className="btn btn-secondary btn-lg">
                  <Ticket size={17} />
                  <span>View in Passes Portal</span>
                </Link>

                <Link to="/profile" className="btn btn-outline btn-lg">
                  <span>My Profile</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Standard 2-Column Checkout Layout matching screenshots */
          <div className="checkout-grid-2col">
            {/* ── LEFT COLUMN: Program & Pass Details ── */}
            <div className="checkout-left-col">
              <div className="checkout-summary-card">
                {/* Official Brand Header inside summary card */}
                <div className="checkout-card-brand-header">
                  <div className="checkout-card-text-brand">
                    <span className="card-brand-tech">Tech</span>
                    <span className="card-brand-talk">Talk</span>
                  </div>
                  <span className="checkout-card-official-tag">OFFICIAL ACCREDITATION</span>
                </div>

                {/* Pass Selector Pill Switcher */}
                <div className="pass-selector-strip" role="tablist">
                  <button
                    type="button"
                    className={`pass-select-pill ${selectedPass === "student-pass" ? "active-student" : ""}`}
                    onClick={() => setSelectedPass("student-pass")}
                  >
                    <GraduationCap size={15} />
                    <span>Student (₹99)</span>
                  </button>

                  <button
                    type="button"
                    className={`pass-select-pill ${selectedPass === "founder-pass" ? "active-founder" : ""}`}
                    onClick={() => setSelectedPass("founder-pass")}
                  >
                    <Briefcase size={15} />
                    <span>Founder (₹499)</span>
                  </button>

                  <button
                    type="button"
                    className={`pass-select-pill ${selectedPass === "delegation-pass" ? "active-delegation" : ""}`}
                    onClick={() => setSelectedPass("delegation-pass")}
                  >
                    <Building size={15} />
                    <span>Delegation (₹250)</span>
                  </button>
                </div>

                {/* Main Heading & Intro Text matching screenshot */}
                <div className="checkout-pass-header">
                  <div className="pass-tier-badge" style={{ color: activePassConfig.accentColor, borderColor: activePassConfig.accentColor }}>
                    <activePassConfig.icon size={13} />
                    <span>{activePassConfig.badge}</span>
                  </div>
                  <h1 className="checkout-program-title">{activePassConfig.heroTitle}</h1>
                  <p className="checkout-lead-text">{activePassConfig.summary}</p>
                </div>

                <div className="checkout-intro-body">
                  <p>{activePassConfig.subSummary}</p>
                </div>

                {/* What's Included Section matching screenshot */}
                <div className="checkout-features-section">
                  <h3 className="checkout-features-title">What's included:</h3>
                  <div className="checkout-features-list">
                    {activePassConfig.features.slice(0, isExpanded ? activePassConfig.features.length : 4).map((feat, idx) => (
                      <div key={idx} className="checkout-feature-item">
                        <div className="feature-item-icon">
                          {idx === 0 && <activePassConfig.icon size={16} style={{ color: activePassConfig.accentColor }} />}
                          {idx === 1 && <FileText size={16} style={{ color: activePassConfig.accentColor }} />}
                          {idx === 2 && <Sparkles size={16} style={{ color: activePassConfig.accentColor }} />}
                          {idx === 3 && <Smartphone size={16} style={{ color: activePassConfig.accentColor }} />}
                          {idx >= 4 && <Check size={16} style={{ color: activePassConfig.accentColor }} />}
                        </div>
                        <div className="feature-item-content">
                          <strong className="feature-item-name">{feat.title}:</strong>{" "}
                          <span className="feature-item-desc">{feat.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activePassConfig.features.length > 4 && (
                    <button
                      type="button"
                      className="checkout-expand-btn"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <><span>See less</span> <ChevronUp size={14} /></>
                      ) : (
                        <><span>See more features ({activePassConfig.features.length - 4} more)</span> <ChevronDown size={14} /></>
                      )}
                    </button>
                  )}
                </div>

                <div className="checkout-closing-note">
                  <p>{activePassConfig.closingNote}</p>
                </div>

                {/* Active Pass Radio Option matching screenshot */}
                <div className="checkout-price-card">
                  <label className="checkout-radio-label">
                    <div className="custom-radio-dot checked">
                      <div className="radio-inner-circle" />
                    </div>
                    <div className="checkout-price-info">
                      <div className="checkout-price-amount">
                        <span className="currency-sym">₹</span>
                        <span className="price-val">{activePassConfig.basePrice}</span>
                        <span className="inr-tag">INR</span>
                      </div>
                      <div className="checkout-price-period">One-time fee • {activePassConfig.discountTag}</div>
                    </div>
                  </label>
                </div>

                {/* Coupon Code Input matching screenshot */}
                <div className="checkout-coupon-section">
                  <form onSubmit={handleApplyCoupon} className="coupon-form-wrap">
                    <div className="coupon-input-group">
                      <Tag size={16} className="coupon-field-icon" />
                      <input
                        type="text"
                        className="checkout-coupon-input"
                        placeholder="Coupon code (e.g. TECHTALK20, STUDENT50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        disabled={!!appliedCoupon}
                      />
                    </div>
                    {appliedCoupon ? (
                      <button 
                        type="button" 
                        className="btn-coupon-remove"
                        onClick={handleRemoveCoupon}
                      >
                        Remove
                      </button>
                    ) : (
                      <button type="submit" className="btn-coupon-apply">
                        Apply
                      </button>
                    )}
                  </form>

                  {couponSuccess && (
                    <div className="coupon-msg-success">
                      <Check size={13} />
                      <span>{couponSuccess}</span>
                    </div>
                  )}

                  {couponError && (
                    <div className="coupon-msg-error">
                      <AlertCircle size={13} />
                      <span>{couponError}</span>
                    </div>
                  )}

                  <div className="coupon-hints-pills">
                    <span className="hint-pill" onClick={() => { setCouponInput("TECHTALK20"); }}>Try: <strong>TECHTALK20</strong> (20% off)</span>
                    <span className="hint-pill" onClick={() => { setCouponInput("STUDENT50"); }}>Try: <strong>STUDENT50</strong> (₹50 off)</span>
                  </div>
                </div>

                {/* Total Due Today Summary matching screenshot */}
                <div className="checkout-total-summary">
                  <div className="total-due-row">
                    <div className="total-due-label">Total due today</div>
                    <div className="total-due-price">
                      <span className="curr">₹</span>{totalAmount} <span className="iso">INR</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="order-details-toggle"
                    onClick={() => setShowOrderDetails(!showOrderDetails)}
                  >
                    <span>{showOrderDetails ? "Hide order details" : "View order details"}</span>
                    {showOrderDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {showOrderDetails && (
                    <div className="order-details-breakdown">
                      <div className="breakdown-line">
                        <span>{activePassConfig.type} Base Fee:</span>
                        <span>₹{baseAmount} INR</span>
                      </div>
                      {appliedCoupon && (
                        <div className="breakdown-line discount">
                          <span>Coupon Discount ({appliedCoupon.code}):</span>
                          <span>-₹{discountAmount} INR</span>
                        </div>
                      )}
                      <div className="breakdown-line">
                        <span>18% GST (Goods &amp; Services Tax):</span>
                        <span>₹{gstAmount} INR</span>
                      </div>
                      <div className="breakdown-line total">
                        <strong>Final Amount Payable:</strong>
                        <strong>₹{totalAmount} INR</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Account & Payment Details ── */}
            <div className="checkout-right-col">
              <form onSubmit={handlePay} className="checkout-payment-form">
                {/* 1. YOUR ACCOUNT */}
                <section className="checkout-section-card">
                  <h2 className="checkout-section-heading">Your account</h2>
                  <div className="checkout-form-grid">
                    <div className="form-field-group">
                      <label className="form-field-label">Email address *</label>
                      <input
                        type="email"
                        required
                        className="checkout-text-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <span className="field-hint">Your verified digital QR pass will be sent here.</span>
                    </div>

                    <div className="form-field-group">
                      <label className="form-field-label">Indian Mobile Number *</label>
                      <div className="phone-input-wrap">
                        <span className="country-dial-code">+91 🇮🇳</span>
                        <input
                          type="tel"
                          required
                          maxLength="10"
                          className="checkout-text-input phone-input"
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      <span className="field-hint">Instant SMS entry pass &amp; WhatsApp check-in confirmation.</span>
                    </div>
                  </div>
                </section>

                {/* 2. PAYMENT DETAILS (INDIAN PAYMENT METHODS) */}
                <section className="checkout-section-card">
                  <h2 className="checkout-section-heading">Payment details</h2>

                  {/* Payment Method Selector Tabs */}
                  <div className="payment-method-tabs" role="tablist">
                    <button
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === "bank" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <Landmark size={17} />
                      <div className="tab-btn-text">
                        <span className="tab-title">Net Banking</span>
                        <span className="tab-sub">All Indian Banks</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === "upi" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <Smartphone size={17} />
                      <div className="tab-btn-text">
                        <span className="tab-title">UPI</span>
                        <span className="tab-sub">GPay, PhonePe, QR</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`payment-tab-btn ${paymentMethod === "card" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={17} />
                      <div className="tab-btn-text">
                        <span className="tab-title">Card</span>
                        <span className="tab-sub">RuPay, Visa, MC</span>
                      </div>
                    </button>
                  </div>

                  {/* METHOD 1: NET BANKING (POPULAR INDIAN BANKS) */}
                  {paymentMethod === "bank" && (
                    <div className="payment-method-panel netbanking-panel">
                      <div className="method-instruction-bar">
                        <Info size={15} style={{ color: "#004c8f" }} />
                        <span>Select your Indian Bank to complete payment via secure NetBanking gateway:</span>
                      </div>

                      {/* Top 6 Popular Indian Banks Grid */}
                      <div className="indian-banks-grid">
                        {POPULAR_INDIAN_BANKS.map((b) => (
                          <div
                            key={b.id}
                            className={`bank-card-item ${selectedBank === b.id ? "selected" : ""}`}
                            onClick={() => { setSelectedBank(b.id); setCustomBank(""); }}
                          >
                            <div className="bank-logo-badge" style={{ backgroundColor: b.color }}>
                              {b.short}
                            </div>
                            <div className="bank-card-info">
                              <span className="bank-full-name">{b.name}</span>
                              <span className="bank-type-tag">{b.badge}</span>
                            </div>
                            <div className="bank-select-radio">
                              <div className={`radio-dot ${selectedBank === b.id ? "active" : ""}`} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Or Search/Select from 35+ Indian Banks */}
                      <div className="form-field-group" style={{ marginTop: "14px" }}>
                        <label className="form-field-label">Or Choose From All Indian Banks</label>
                        <select
                          className="checkout-text-input checkout-select"
                          value={customBank}
                          onChange={(e) => {
                            setCustomBank(e.target.value);
                            if (e.target.value) setSelectedBank("other");
                          }}
                        >
                          <option value="">Select Other Indian Bank...</option>
                          {ALL_INDIAN_BANKS.map((bName) => (
                            <option key={bName} value={bName}>{bName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field-group" style={{ marginTop: "10px" }}>
                        <label className="form-field-label">Account Holder Name (As per Bank Records)</label>
                        <input
                          type="text"
                          className="checkout-text-input"
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                          placeholder="e.g. Your full name"
                        />
                      </div>
                    </div>
                  )}

                  {/* METHOD 2: UPI (INSTANT INDIAN PAYMENTS) */}
                  {paymentMethod === "upi" && (
                    <div className="payment-method-panel upi-panel">
                      <div className="upi-mode-selector">
                        <button
                          type="button"
                          className={`upi-mode-pill ${upiMethod === "id" ? "active" : ""}`}
                          onClick={() => setUpiMethod("id")}
                        >
                          Enter UPI ID / VPA
                        </button>
                        <button
                          type="button"
                          className={`upi-mode-pill ${upiMethod === "qr" ? "active" : ""}`}
                          onClick={() => setUpiMethod("qr")}
                        >
                          Scan Dynamic QR Code
                        </button>
                      </div>

                      {upiMethod === "id" ? (
                        <div>
                          {/* Quick UPI App Icons */}
                          <div className="upi-apps-row">
                            <button
                              type="button"
                              className={`upi-app-btn ${selectedUpiApp === "gpay" ? "selected" : ""}`}
                              onClick={() => { setSelectedUpiApp("gpay"); setUpiId("username@okhdfcbank"); }}
                            >
                              <div className="app-dot gpay">G</div>
                              <span>Google Pay</span>
                            </button>

                            <button
                              type="button"
                              className={`upi-app-btn ${selectedUpiApp === "phonepe" ? "selected" : ""}`}
                              onClick={() => { setSelectedUpiApp("phonepe"); setUpiId("username@ybl"); }}
                            >
                              <div className="app-dot phonepe">Pe</div>
                              <span>PhonePe</span>
                            </button>

                            <button
                              type="button"
                              className={`upi-app-btn ${selectedUpiApp === "paytm" ? "selected" : ""}`}
                              onClick={() => { setSelectedUpiApp("paytm"); setUpiId("username@paytm"); }}
                            >
                              <div className="app-dot paytm">P</div>
                              <span>Paytm</span>
                            </button>

                            <button
                              type="button"
                              className={`upi-app-btn ${selectedUpiApp === "bhim" ? "selected" : ""}`}
                              onClick={() => { setSelectedUpiApp("bhim"); setUpiId("username@upi"); }}
                            >
                              <div className="app-dot bhim">B</div>
                              <span>BHIM</span>
                            </button>
                          </div>

                          <div className="form-field-group" style={{ marginTop: "14px" }}>
                            <label className="form-field-label">Virtual Payment Address (UPI ID) *</label>
                            <input
                              type="text"
                              required={paymentMethod === "upi"}
                              className="checkout-text-input mono-code"
                              placeholder="e.g. mobile@okhdfcbank or user@ybl"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                            <span className="field-hint">Enter your registered UPI Virtual Private Address (VPA).</span>
                          </div>
                        </div>
                      ) : (
                        <div className="upi-qr-box">
                          <div className="qr-render-box">
                            <PassQRCodeSVG value={`upi://pay?pa=nexzibyte@hdfcbank&pn=TechTalk&am=${totalAmount}&cu=INR`} size={130} />
                          </div>
                          <div className="qr-info-box">
                            <strong>Scan with any UPI App</strong>
                            <p>Open GPay, PhonePe, Paytm or BHIM on your smartphone to scan and authorize ₹{totalAmount} INR.</p>
                            <span className="qr-validity-tag">Expires in 10:00 mins</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* METHOD 3: CARD (RUPAY / VISA / MASTERCARD / AMEX) */}
                  {paymentMethod === "card" && (
                    <div className="payment-method-panel card-panel">
                      <div className="form-field-group">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <label className="form-field-label">Card number *</label>
                          <div className="card-brand-logos">
                            <span className="brand-pill rupay">RuPay 🇮🇳</span>
                            <span className="brand-pill visa">VISA</span>
                            <span className="brand-pill mc">Mastercard</span>
                          </div>
                        </div>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          maxLength="19"
                          className="checkout-text-input mono-code"
                          placeholder="1234 1234 1234 1234"
                          value={cardNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCardNumber(val);
                          }}
                        />
                      </div>

                      <div className="card-expiry-cvc-grid">
                        <div className="form-field-group">
                          <label className="form-field-label">Expiration date *</label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            maxLength="5"
                            className="checkout-text-input mono-code"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                              setCardExpiry(val);
                            }}
                          />
                        </div>

                        <div className="form-field-group">
                          <label className="form-field-label">Security code (CVV) *</label>
                          <input
                            type="password"
                            required={paymentMethod === "card"}
                            maxLength="4"
                            className="checkout-text-input mono-code"
                            placeholder="CVC"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>

                      <div className="form-field-group" style={{ marginTop: "12px" }}>
                        <label className="form-field-label">Name on card *</label>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          className="checkout-text-input"
                          placeholder="Full Name as printed on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* BILLING ADDRESS & ATTENDEE DETAILS */}
                  <div className="checkout-billing-fields" style={{ marginTop: "20px" }}>
                    <div className="form-field-group">
                      <label className="form-field-label">Full name *</label>
                      <input
                        type="text"
                        required
                        className="checkout-text-input"
                        placeholder="e.g. Lalitha Mindhi"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="card-expiry-cvc-grid">
                      <div className="form-field-group">
                        <label className="form-field-label">Country or region *</label>
                        <select
                          className="checkout-text-input checkout-select"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value="India">India 🇮🇳</option>
                        </select>
                      </div>

                      <div className="form-field-group">
                        <label className="form-field-label">State / UT *</label>
                        <select
                          className="checkout-text-input checkout-select"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="card-expiry-cvc-grid">
                      <div className="form-field-group">
                        <label className="form-field-label">Billing address</label>
                        <input
                          type="text"
                          className="checkout-text-input"
                          placeholder="Street Address, Area"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-field-label">PIN Code *</label>
                        <input
                          type="text"
                          maxLength="6"
                          className="checkout-text-input mono-code"
                          placeholder="Postal code"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>

                    {/* Contextual Institutional / Business Details based on Pass */}
                    {selectedPass === "student-pass" && (
                      <div className="card-expiry-cvc-grid">
                        <div className="form-field-group">
                          <label className="form-field-label">College / University Name *</label>
                          <input
                            type="text"
                            required
                            className="checkout-text-input"
                            placeholder="e.g. JNTU Hyderabad / Osmania University"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label className="form-field-label">Degree &amp; Graduation Year *</label>
                          <input
                            type="text"
                            required
                            className="checkout-text-input"
                            placeholder="e.g. B.Tech CSE (2026)"
                            value={studentDegree}
                            onChange={(e) => setStudentDegree(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {selectedPass === "founder-pass" && (
                      <div className="card-expiry-cvc-grid">
                        <div className="form-field-group">
                          <label className="form-field-label">Startup / Venture Name *</label>
                          <input
                            type="text"
                            required
                            className="checkout-text-input"
                            placeholder="e.g. AgenticIQ / MyStartup.ai"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label className="form-field-label">Venture Stage</label>
                          <select
                            className="checkout-text-input checkout-select"
                            value={ventureStage}
                            onChange={(e) => setVentureStage(e.target.value)}
                          >
                            <option value="Bootstrapped / Early Revenue">Bootstrapped / Early Revenue</option>
                            <option value="Pre-Seed (Building MVP)">Pre-Seed (Building MVP)</option>
                            <option value="Seed Stage">Seed Stage</option>
                            <option value="Series A+">Series A+</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {selectedPass === "delegation-pass" && (
                      <div className="card-expiry-cvc-grid">
                        <div className="form-field-group">
                          <label className="form-field-label">Corporate Enterprise Firm *</label>
                          <input
                            type="text"
                            required
                            className="checkout-text-input"
                            placeholder="e.g. NexziByte / Tech Enterprise"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label className="form-field-label">Corporate Designation *</label>
                          <input
                            type="text"
                            required
                            className="checkout-text-input"
                            placeholder="e.g. Principal Cloud Architect"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Add Tax ID (Optional for GST input credit) */}
                    <div className="tax-id-toggle-wrap">
                      <button
                        type="button"
                        className="tax-id-toggle-btn"
                        onClick={() => setShowTaxId(!showTaxId)}
                      >
                        {showTaxId ? "− Hide Tax ID / GSTIN" : "+ Add Tax ID / GSTIN (Optional)"}
                      </button>

                      {showTaxId && (
                        <div className="tax-id-field-box">
                          <label className="form-field-label">GSTIN / Corporate Tax Identification Number</label>
                          <input
                            type="text"
                            className="checkout-text-input mono-code"
                            placeholder="e.g. 36AABCN1234A1Z5"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value.toUpperCase())}
                          />
                          <span className="field-hint">Enter your 15-character GST number to claim Input Tax Credit (ITC).</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="terms-checkbox-wrap">
                    <label className="terms-label">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="terms-checkbox"
                      />
                      <span>
                        I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>terms of service</a> and have read the <a href="#privacy" onClick={(e) => e.preventDefault()}>privacy policy</a>
                      </span>
                    </label>
                  </div>

                  {/* Primary Pay Button matching screenshot */}
                  <button
                    type="submit"
                    className="checkout-pay-btn"
                    disabled={!agreeTerms || isProcessing}
                  >
                    {isProcessing ? (
                      <div className="btn-spinner-wrap">
                        <div className="spinner-border" />
                        <span>Authorizing with Indian Bank Gateway...</span>
                      </div>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Pay ₹{totalAmount} INR</span>
                      </>
                    )}
                  </button>

                  <div className="payment-security-footer">
                    <ShieldCheck size={14} style={{ color: "#059669" }} />
                    <span>Regulated under Reserve Bank of India (RBI) payment security directives.</span>
                  </div>
                </section>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
