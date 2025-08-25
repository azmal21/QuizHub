import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";
import "../styles/UserLogin.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const OTP_EXPIRATION_TIME = 300; // 5 minutes in seconds

const UserLogin = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const navigate = useNavigate();

  // Clear recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Countdown timer for OTP expiration
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  // Initialize reCAPTCHA
  const setupRecaptcha = useCallback(() => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }

    const container = document.getElementById("recaptcha-container");
    if (!container) {
      toast.error("Recaptcha container not found.");
      return;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("reCAPTCHA verified"),
      "expired-callback": () => toast.error("reCAPTCHA expired. Try again."),
      "error-callback": (err) => {
        console.error("reCAPTCHA error:", err);
        toast.error("Recaptcha error. Try again.");
      },
    });
  }, []);

  // Send OTP
  const sendOtp = useCallback(async () => {
    if (!name.trim()) return toast.warning("Enter your name.");
    if (!phone.trim() || phone.length !== 10) return toast.warning("Enter a valid 10-digit phone number.");

    setLoading(true);
    try {
      const { data } = await api.post("/user/precheck", { name, phone });
      if (!data.success) {
        toast.error(data.message || "User validation failed.");
        setLoading(false);
        return;
      }

      setupRecaptcha();
      if (!window.recaptchaVerifier) throw new Error("Recaptcha not initialized");

      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpTimer(OTP_EXPIRATION_TIME);

      toast.success("OTP sent to your phone number.");
    } catch (err) {
      console.error("Error sending OTP:", err);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      const errorMap = {
        "auth/too-many-requests": "Too many requests. Try later.",
        "auth/invalid-phone-number": "Invalid phone number.",
        "auth/quota-exceeded": "SMS quota exceeded. Contact support.",
      };
      toast.error(errorMap[err.code] || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }, [name, phone, setupRecaptcha]);

  // Verify OTP
  const verifyOtp = useCallback(async () => {
    if (!otp.trim() || otp.length !== 6) return toast.warning("Enter 6-digit OTP.");
    if (!confirmationResult) return toast.error("No OTP requested. Please request OTP again.");

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp.trim());

      // Login API
      const { data } = await api.post("/user/login", {
        name: name.trim(),
        phone: phone.trim(),
        firebaseUid: result.user.uid,
      });

      if (data.success) {
        // Minimal localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("firebaseUid", result.user.uid);
        localStorage.setItem("userName", name.trim());
        localStorage.setItem("userPhone", phone.trim());

        setName("");
        setPhone("");
        setOtp("");
        setConfirmationResult(null);

        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMap = {
        "auth/invalid-verification-code": "Invalid OTP.",
        "auth/code-expired": "OTP expired. Request again.",
        "auth/network-request-failed": "Network error. Try again.",
      };
      toast.error(errorMap[err.code] || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }, [otp, confirmationResult, name, phone, navigate]);

  // Resend OTP
  const resendOtp = useCallback(() => {
    setConfirmationResult(null);
    setOtp("");
    sendOtp();
  }, [sendOtp]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>User Login</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading || confirmationResult}
          className="login-input"
        />

        <input
          type="tel"
          placeholder="Enter your phone number (10 digits)"
          value={phone}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            if (onlyNums.length <= 10) setPhone(onlyNums);
          }}
          disabled={loading || confirmationResult}
          className="login-input"
        />

        {!confirmationResult ? (
          <button
            onClick={sendOtp}
            disabled={loading || !name.trim() || phone.length !== 10}
            className="login-button"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                if (onlyNums.length <= 6) setOtp(onlyNums);
              }}
              maxLength="6"
              disabled={loading}
              className="login-input"
            />

            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="login-button"
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>

            <button
              onClick={resendOtp}
              disabled={loading || otpTimer > 0}
              className="login-button secondary"
            >
              Resend OTP {otpTimer > 0 && `(${otpTimer}s)`}
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default UserLogin;
