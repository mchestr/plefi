import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlexAccess, setHasPlexAccess] = useState(null);
  const [hasSubscriptions, setHasSubscriptions] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check Plex access
        const plexResponse = await fetch('/api/v1/plex/check-access');
        if (plexResponse.ok) {
          const plexData = await plexResponse.json();
          setHasPlexAccess(plexData.has_access || false);
        } else {
          setHasPlexAccess(false);
        }

        // Check if user has subscriptions
        const subscriptionsResponse = await fetch('/api/v1/stripe/subscriptions');
        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          setHasSubscriptions(
            subscriptionsData.subscriptions &&
            subscriptionsData.subscriptions.length > 0
          );
        }

        // Check admin via user info
        const meResponse = await fetch('/api/v1/user/me');
        if (meResponse.ok) {
          const meData = await meResponse.json();
          setHasAdmin(meData.user?.is_admin || false);
        } else {
          setHasAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setHasPlexAccess(false);
        setHasAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="font-sans bg-[#1e272e] text-[#f1f2f6] flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#1e272e] text-[#f1f2f6] flex flex-col justify-center items-center min-h-screen overflow-x-hidden">
      <div className="bg-[#2d3436] shadow-lg shadow-black/20 p-8 md:p-12 rounded-xl text-center max-w-md w-[90%] relative">
        {/* Coffee ribbon */}
        <a href="/stripe/donation" className="absolute -right-2 -top-2 overflow-hidden w-28 h-28 z-10 cursor-pointer">
          <div className="absolute transform rotate-45 bg-[#e5a00d]/80 text-[#191a1c] font-bold text-xs py-1 right-[-35px] top-[32px] w-[170px] text-center shadow-sm hover:bg-[#f5b82e]/80 transition-colors duration-200">
            buy me a coffee ☕
          </div>
        </a>

        {/* Admin banner along the bottom */}
        {hasAdmin && (
          <a
            className="absolute bottom-0 left-0 right-0 bg-red-600/80 text-white py-2 text-center font-bold text-sm rounded-b-xl hover:bg-red-700/80 transition-colors duration-200"
          >
            Admin
          </a>
        )}

        <h1 className="text-4xl md:text-[3.5rem] font-extrabold mb-6 tracking-tight text-[#f1f2f6] leading-tight">PleFi</h1>
        
        <div className="mb-6 text-blue-400">
          {hasPlexAccess === true ? (
            <div className="text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <p className="text-lg mb-8 text-[#f1f2f6]">
          {hasPlexAccess === true 
            ? "You have access to Plex content." 
            : "You do not have access to Plex content."}
        </p>
        
        <div className="space-y-4 mb-6">
          {hasSubscriptions ? (
            // Show subscription management button for users with subscriptions
            <button
              onClick={() => navigate('/subscriptions')}
              className="w-full flex items-center justify-center bg-[#2c3e50] hover:bg-[#34495e] text-[#f1f2f6] font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-lg"
            >
              Manage Subscriptions
            </button>
          ) : !hasPlexAccess ? (
            // Show subscribe button for users without subscriptions and without Plex access
            <button
              onClick={() => window.location.href = '/stripe/subscribe'}
              className="w-full flex items-center justify-center bg-[#e5a00d] hover:bg-[#f5b82e] text-[#191a1c] font-bold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              Subscribe Now
            </button>
          ) : null}
        </div>
        
        {/* Sign out link - add more bottom margin when admin banner is shown */}
        <div className={`mt-8 ${hasAdmin ? 'mb-8' : ''}`}>
          <button 
            onClick={handleSignOut}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
