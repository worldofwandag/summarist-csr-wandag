"use client";
import Image from "next/image";
import pricing from "../assets/pricing-top.webp";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store"; // for TS
import { setSubscribed, setPlusSubscribed } from "../redux/userSlice"; // Redux actions

const Page = () => {
  // Set "Premium Plus Yearly" as the default active plan
  const [activePlan, setActivePlan] = useState<
    "premium plus annual" | "premium monthly"
  >("premium plus annual");
  const user = useSelector((state: RootState) => state.user.user);
  const isSubscribed = useSelector(
    (state: RootState) => state.user.isSubscribed
  );
  const isPlusSubscribed = useSelector(
    (state: RootState) => state.user.isPlusSubscribed
  );
  const dispatch = useDispatch();

   // Fetch subscription state from Firestore and sync with Redux
   useEffect(() => {
    const fetchSubscriptionState = async () => {
      if (!user?.email) return; // Ensure the user is logged in

      try {
        const response = await fetch(`/api/getSubscriptionState?email=${user.email}`);
        if (response.ok) {
          const { isSubscribed, isPlusSubscribed } = await response.json();
          dispatch(setSubscribed(isSubscribed));
          dispatch(setPlusSubscribed(isPlusSubscribed));
          localStorage.setItem("isSubscribed", String(isSubscribed));
          localStorage.setItem("isPlusSubscribed", String(isPlusSubscribed));
        } else {
          console.error("Failed to fetch subscription state");
        }
      } catch (error) {
        console.error("Error fetching subscription state:", error);
      }
    };

    fetchSubscriptionState();
  }, [user?.email, dispatch]);

  const handleCheckout = async () => {
    console.log("handleCheckout called");
    console.log("Active Plan:", activePlan);
    console.log("isSubscribed (Redux):", isSubscribed);
    console.log("isPlusSubscribed (Redux):", isPlusSubscribed);
    if (!activePlan) {
      alert("Please select a plan before proceeding.");
      return;
    }

    // Prevent duplicate subscriptions
    if (
      (activePlan === "premium plus annual" && isPlusSubscribed) ||
      (activePlan === "premium monthly" && isSubscribed)
    ) {
      alert("You are already subscribed to this plan.");
      return;
    }

    try {
      console.log("Starting checkout process for plan:", activePlan);

      const lookupKey = activePlan;
      const email = user?.email; // Retrieve the user's email from Redux or context

      if (!email) {
        alert("User email is required to proceed with the checkout.");
        return;
      }

      console.log("Sending request with:", { lookupKey, email });

      const response = await fetch("/api/createCheckoutSessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lookupKey, email }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("Failed to create checkout session.");
      }

      console.log("Redirecting to Stripe Checkout with sessionId:", sessionId);

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      await stripe?.redirectToCheckout({ sessionId });




      // Temporary workaround: Update Redux state and persist it BEGINNING
      
      if (activePlan === "premium plus annual") {
        console.log("Setting isPlusSubscribed to true in localStorage");
        dispatch(setPlusSubscribed(true));
        localStorage.setItem("isPlusSubscribed", "true");
        console.log("isPlusSubscribed set to true");
      } else if (activePlan === "premium monthly") {
        console.log("Setting isSubscribed to true in localStorage");
        dispatch(setSubscribed(true));
        localStorage.setItem("isSubscribed", "true");
        console.log("isSubscribed set to true");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong. Please try again.");
    }

    // Temporary workaround: Update Redux state and persist it END




  };

  return (
    <div className="plan">
      <div className="plan__header--wrapper">
        <div className="plan__header">
          <div className="plan__title">
            Get unlimited access to many amazing books to read
          </div>
          <div className="plan__sub--title">
            Turn ordinary moments into amazing learning opportunities
          </div>
          <figure className="plan__img--mask">
            <Image alt="pricing" src={pricing} height={722} width={860} />
          </figure>
        </div>
      </div>
      <div className="row">
        <div className="container">
          <div className="plan__features--wrapper">
            <div className="plan__features">
              <figure className="plan__features--icon">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 1024 1024"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM320 482a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h384a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8H320zm0 136a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h184a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8H320z"></path>
                </svg>
              </figure>
              <div className="plan__features--text">
                <b>Key ideas in few min</b> with many books to read
              </div>
            </div>
            <div className="plan__features">
              <figure className="plan__features--icon">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path fill="none" d="M0 0H24V24H0z"></path>
                    <path d="M21 3v2c0 3.866-3.134 7-7 7h-1v1h5v7c0 1.105-.895 2-2 2H8c-1.105 0-2-.895-2-2v-7h5v-3c0-3.866 3.134-7 7-7h3zM5.5 2c2.529 0 4.765 1.251 6.124 3.169C10.604 6.51 10 8.185 10 10v1h-.5C5.358 11 2 7.642 2 3.5V2h3.5z"></path>
                  </g>
                </svg>
              </figure>
              <div className="plan__features--text">
                <b>3 million</b> people growing with Summarist everyday
              </div>
            </div>
          </div>
          <div className="section__title">Choose the plan that fits you</div>

          {/* PREMIUM PLUS YEARLY */}
          <div
            className={`plan__card ${
              activePlan === "premium plus annual" ? "plan__card--active" : ""
            }`}
            onClick={() => setActivePlan("premium plus annual")}
          >
            <div className="plan__card--circle">
              <div className="plan__card--dot"></div>
            </div>
            <div className="plan__card--content">
              <div className="plan__card--title">Premium Plus Yearly</div>
              <div className="plan__card--price">$99.99/year</div>
              <div className="plan__card--text">7-day free trial included</div>
            </div>
          </div>

          <div className="plan__card--separator">
            <div className="plan__separator">or</div>
          </div>

          {/* PREMIUM MONTHLY */}
          <div
            className={`plan__card ${
              activePlan === "premium monthly" ? "plan__card--active" : ""
            }`}
            onClick={() => setActivePlan("premium monthly")}
          >
            <div className="plan__card--circle"></div>
            <div className="plan__card--content">
              <div className="plan__card--title">Premium Monthly</div>
              <div className="plan__card--price">$9.99/month</div>
              <div className="plan__card--text">No trial included</div>
            </div>
          </div>
          {/* SUBSCRIBE BUTTON */}
          <div className="plan__card--cta">
            <span className="btn--wrapper">
              <button
                className="btn"
                style={{ width: "300px" }}
                onClick={handleCheckout}
              >
                <span>
                  {activePlan === "premium monthly"
                    ? "Start your first month"
                    : "Start your free 7-day trial"}
                </span>
              </button>
            </span>
            <div className="plan__disclaimer">
              {activePlan === "premium monthly"
                ? "30-day money back guarantee, no questions asked."
                : "Cancel your trial at any time before it ends, and you won't be charged."}
            </div>
          </div>

          {/* FAQ WRAPPER */}
          <div className="faq__wrapper">
            <div className="accordion__card">
              <div className="accordion__header">
                <div className="accordion__title">
                  How does the free 7-day trial work?
                </div>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="accordion__icon accordion__icon--rotate"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>
              <div className="collapse show" style={{ height: "96px" }}>
                <div className="accordion__body">
                  Begin your complimentary 7-day trial with a Summarist annual
                  membership. You are under no obligation to continue your
                  subscription, and you will only be billed when the trial
                  period expires. With Premium access, you can learn at your own
                  pace and as frequently as you desire, and you may terminate
                  your subscription prior to the conclusion of the 7-day free
                  trial.
                </div>
              </div>
            </div>
            <div className="accordion__card">
              <div className="accordion__header">
                <div className="accordion__title">
                  Can I switch subscriptions from monthly to yearly, or yearly
                  to monthly?
                </div>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="accordion__icon "
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>
              <div className="collapse " style={{ height: "0px" }}>
                <div className="accordion__body">
                  While an annual plan is active, it is not feasible to switch
                  to a monthly plan. However, once the current month ends,
                  transitioning from a monthly plan to an annual plan is an
                  option.
                </div>
              </div>
            </div>
            <div className="accordion__card">
              <div className="accordion__header">
                <div className="accordion__title">
                  What's included in the Premium plan?
                </div>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="accordion__icon "
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>
              <div className="collapse " style={{ height: "0px" }}>
                <div className="accordion__body">
                  Premium membership provides you with the ultimate Summarist
                  experience, including unrestricted entry to many best-selling
                  books high-quality audio, the ability to download titles for
                  offline reading, and the option to send your reads to your
                  Kindle.
                </div>
              </div>
            </div>
            <div className="accordion__card">
              <div className="accordion__header">
                <div className="accordion__title">
                  Can I cancel during my trial or subscription?
                </div>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="accordion__icon "
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  ></path>
                </svg>
              </div>
              <div className="collapse " style={{ height: "0px" }}>
                <div className="accordion__body">
                  You will not be charged if you cancel your trial before its
                  conclusion. While you will not have complete access to the
                  entire Summarist library, you can still expand your knowledge
                  with one curated book per day.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              <div className="footer__block">
                <div className="footer__link--title">Actions</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Magazine</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Cancel Subscription</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Help</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Contact us</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Useful Links</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Pricing</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Business</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Gift Cards</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Authors &amp; Publishers</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Company</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">About</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Careers</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Partners</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Code of Conduct</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Other</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Sitemap</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Legal Notice</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Terms of Service</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Privacy Policies</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">
                Copyright © 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
