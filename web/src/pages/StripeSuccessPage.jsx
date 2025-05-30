import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

function StripeSuccessPage({ type }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="font-sans bg-[#1e272e] text-[#f1f2f6] min-h-screen py-8 px-4 flex flex-col items-center">
      <div className="max-w-3xl mx-auto text-center p-12 rounded-xl shadow-lg bg-[#2d3436] shadow-black/20">
        <div
          className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full text-4xl font-light bg-[#2b8a3e] text-[#e3f9e5]`}
        >
          {type === "Donation" ? "❤️" : "✓"}
        </div>

        <h1 className="text-4xl font-extrabold mb-4">
          {type === "Donation"
            ? "Thank You for Your Donation!"
            : `${type} Successful!`}
        </h1>

        {type === "Subscription" ? (
          <p className="text-lg mb-6 text-[#f1f2f6]">
            Thank you{user ? `, ${user.username}` : ""}! Your subscription will
            be activated soon.
          </p>
        ) : (
          <p className="text-lg mb-6 text-[#f1f2f6]">
            Your support is greatly appreciated
            {user ? `, ${user.username}` : ""}!
          </p>
        )}

        {type === "Donation" ? (
          <p className="text-lg mb-6 text-[#f1f2f6]">
            We <span className="inline-block animate-pulse">❤️</span> supporters
            like you!
          </p>
        ) : (
          <>
            <p className="text-lg mb-6 text-[#f1f2f6]">
              An invite has been sent to your account and should have been
              auto-accepted.
            </p>
            <p className="text-lg mb-6 text-[#f1f2f6]">
              You may need to accept the invite within your Plex account to gain
              full access.
            </p>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {type === "Donation" ? (
            <button
              onClick={() => navigate("/")}
              className="px-7 py-3 bg-[#e5a00d] hover:bg-[#f5b82e] text-[#191a1c] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Return Home
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/onboarding")}
                className="px-7 py-3 bg-[#e5a00d] hover:bg-[#f5b82e] text-[#191a1c] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
              >
                Get Started
              </button>

              <a
                href="https://app.plex.tv/desktop/#!/settings/manage-library-access"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 bg-[#34495e] hover:bg-[#2c3e50] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Check Plex Requests
              </a>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default StripeSuccessPage;
