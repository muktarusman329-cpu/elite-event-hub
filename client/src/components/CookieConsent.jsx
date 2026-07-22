import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (!consent) {
      setShowBanner(true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    document.body.style.overflow = "auto";
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    document.body.style.overflow = "auto";
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Blurred Background */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/20 rounded-3xl shadow-2xl p-8">

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
              🍪
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-4">
            We Use Cookies
          </h2>

          <p className="text-gray-300 text-center mb-6">
            We use cookies and similar technologies to improve your
            experience, analyze website traffic, and personalize content.
          </p>

          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400">
              By clicking "Accept All", you agree to our use of cookies.
              Read our{" "}
              <Link
                to="/privacy-policy"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 border border-gray-600 text-white py-3 rounded-xl hover:bg-slate-800 transition"
            >
              Decline
            </button>

            <button
              onClick={handleAccept}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition"
            >
              Accept All
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CookieConsent;