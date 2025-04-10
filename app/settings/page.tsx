"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import login from "../assets/login.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { openLoginModal } from "../redux/modalSlice";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); // Access Redux state
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const isSubscribed = useSelector(
    (state: RootState) => state.user.isSubscribed
  ); // Check if user is subscribed
  const isPlusSubscribed = useSelector(
    (state: RootState) => state.user.isPlusSubscribed
  ); // Check if user is premium-plus subscribed
  const user = useSelector((state: RootState) => state.user.user); // Access user object
  const isGuestLoggedIn = useSelector(
    (state: RootState) => state.user.isGuestLoggedIn
  ); // Check if user is logged in as a guest

  // Determine subscription tier text
  const subscriptionTier =
    !isSubscribed && !isPlusSubscribed
      ? "Basic"
      : isSubscribed
      ? "Premium"
      : "Premium-Plus";

  // Determine email text
  const emailText = isGuestLoggedIn
    ? "Email unknown for guest"
    : user?.email || "Email not available";

  // Access Redux state to check if the login modal is open
  const { loginModalOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="row">
          <div className="section__title page__title">Settings</div>

          {isLoggedIn ? (
            <>
              {isLoading ? (
                <div>
                  <div className="setting__content">
                    <div
                      className="skeleton"
                      style={{
                        width: "20%",
                        height: "24px",
                        marginBottom: "8px",
                      }}
                    ></div>
                    <div
                      className="skeleton"
                      style={{
                        width: "16%",
                        height: "12px",
                        marginBottom: "2px",
                      }}
                    ></div>
                  </div>
                  <div className="setting__content">
                    <div
                      className="skeleton"
                      style={{
                        width: "8%",
                        height: "24px",
                        marginBottom: "8px",
                      }}
                    ></div>
                    <div
                      className="skeleton"
                      style={{
                        width: "20%",
                        height: "12px",
                        marginBottom: "16px",
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="setting__content">
                    <div className="settings__sub--title">
                      Your Subscription plan
                    </div>
                    <div className="settings__text">{subscriptionTier}</div>
                  </div>
                  <div className="setting__content">
                    <div className="settings__sub--title">Email</div>
                    <div className="settings__text">{emailText}</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="settings__login--wrapper">
                <Image alt="login" src={login} height={712} width={1033} />
                <div className="settings__login--text">
                  Log in to your account to see your details.
                </div>
                <button
                  className="btn settings__login--btn"
                  onClick={() => dispatch(openLoginModal())}
                >
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
