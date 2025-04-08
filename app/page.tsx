"use client";

import Image from "next/image";
import logo from "./assets/logo.png";
import landing from "./assets/landing.png";
import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import Modal from "./components/Modal";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store"; // for TypeScript
import { openLoginModal } from "./redux/modalSlice";


export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  // Access Redux state to check if the login modal is open
  const { loginModalOpen } = useSelector((state: RootState) => state.modal);

  const [activeIndex, setActiveIndex] = useState(0);
  const texts = [
    "Enhance your knowledge",
    "Achieve greater success",
    "Improve your health",
    "Develop better parenting skills",
    "Increase happiness",
    "Be the best version of yourself!",
  ];
  const secondTexts = [
    "Expand your learning",
    "Accomplish your goals",
    "Strengthen your vitality",
    "Become a better caregiver",
    "Improve your mood",
    "Maximize your abilities",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* modal */}

      {loginModalOpen && <Modal />}

      {/* header */}

      {/* nav */}
      <nav className="nav">
        <div className="nav__wrapper">
          <figure className="nav__img--mask">
            <Image src={logo} width={500} height={500} alt="logo" />
          </figure>
          <ul className="nav__list--wrapper">
            <li
              className="nav__list nav__list--login"
              onClick={() => dispatch(openLoginModal())} // Dispatch openLoginModal
            >
              Login
            </li>
            <li className="nav__list nav__list--mobile">About</li>
            <li className="nav__list nav__list--mobile">Contact</li>
            <li className="nav__list nav__list--mobile">Help</li>
          </ul>
        </div>
      </nav>

      {/* landing */}

      <section id="landing">
        <div className="row">
          <div className="container">
            <div className="landing__wrapper">
              <div className="landing__content">
                <div className="leading-tight landing__content__title">
                  Gain more knowledge <br className="remove--tablet" />
                  in less time
                </div>
                <div className="landing__content__subtitle ">
                  Great summaries for busy people,
                  <br className="remove--tablet" />
                  individuals who barely have time to read,
                  <br className="remove--tablet" />
                  and even people who don’t like to read.
                </div>
                <button
                  className="btn home__cta--btn"
                  onClick={() => dispatch(openLoginModal())} // Dispatch openLoginModal
                >
                  Login
                </button>
              </div>
              <figure className="landing__image--mask">
                <Image
                  src={landing}
                  width={500}
                  height={500}
                  alt="landing image"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* features */}

      <section id="features">
        <div className="row">
          <div className="container">
            <div className="section__title">
              Understand books in few minutes
            </div>
            <div className="features__wrapper">
              <div className="features">
                <div className="features__icon">
                  <AiFillFileText />
                </div>
                <div className="features__title">Read or listen</div>
                <div className="features__sub--title">
                  Save time by getting the core ideas from the best books.
                </div>
              </div>
              <div className="features">
                <div className="features__icon">
                  <AiFillBulb />
                </div>
                <div className="features__title">Find your next read</div>
                <div className="features__sub--title">
                  Explore book lists and personalized recommendations.
                </div>
              </div>
              <div className="features">
                <div className="features__icon">
                  <AiFillAudio />
                </div>
                <div className="features__title">Briefcasts</div>
                <div className="features__sub--title">
                  Gain valuable insights from briefcasts
                </div>
              </div>
            </div>
            <div className="statistics__wrapper">
              <div className="statistics__content--header">
                {texts.map((text, index) => (
                  <div
                    key={index}
                    className="statistics__heading"
                    style={{
                      color: activeIndex === index ? "#2bd97c" : "#6b757b",
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>
              <div className="statistics__content--details">
                <div className="statistics__data">
                  <div className="statistics__data--number">93%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>significantly increase</b> reading
                    frequency.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">96%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>establish better</b> habits.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">90%</div>
                  <div className="statistics__data--title">
                    have made <b>significant positive</b> change to their lives.
                  </div>
                </div>
              </div>
            </div>
            <div className="statistics__wrapper">
              <div className="statistics__content--details statistics__content--details-second">
                <div className="statistics__data">
                  <div className="statistics__data--number">91%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>report feeling more productive</b>
                    {""} after incorporating the service into their daily
                    routine.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">94%</div>
                  <div className="statistics__data--title">
                    of Summarist members have <b>noticed an improvement</b> in
                    their overall comprehension and retention of information.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">88%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>feel more informed</b> about current
                    events and industry trends since using the platform.
                  </div>
                </div>
              </div>
              <div className="statistics__content--header statistics__content--header-second">
                {secondTexts.map((text, index) => (
                  <div
                    key={index}
                    className="statistics__heading"
                    style={{
                      color: activeIndex === index ? "#2bd97c" : "#6b757b",
                    }}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}

      <section id="reviews">
        <div className="row">
          <div className="container">
            <div className="section__title">What our members say</div>
            <div className="reviews__wrapper">
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Hanna M.</div>
                  <div className="review__stars">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  This app has been a <b>game-changer</b> for me! It's saved me
                  so much time and effort in reading and comprehending books.
                  Highly recommend it to all book lovers.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">David B.</div>
                  <div className="review__stars">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  I love this app! It provides{" "}
                  <b>concise and accurate summaries</b> of books in a way that
                  is easy to understand. It's also very user-friendly and
                  intuitive.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Nathan S.</div>
                  <div className="review__stars">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  This app is a great way to get the main takeaways from a book
                  without having to read the entire thing.{" "}
                  <b>The summaries are well-written and informative.</b>{" "}
                  Definitely worth downloading.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Ryan R.</div>
                  <div className="review__stars">
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                    <BsStarFill />
                  </div>
                </div>
                <div className="review__body">
                  If you're a busy person who{" "}
                  <b>loves reading but doesn't have the time</b> to read every
                  book in full, this app is for you! The summaries are thorough
                  and provide a great overview of the book's content.
                </div>
              </div>
            </div>
            <div className="reviews__btn--wrapper">
              <button
                className="btn home__cta--btn"
                onClick={() => dispatch(openLoginModal())} // Dispatch openLoginModal
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* numbers */}

      <section id="numbers">
        <div className="row">
          <div className="container">
            <div className="section__title">
              Start growing with Summarist now
            </div>
            <div className="numbers__wrapper">
              <div className="numbers">
                <div className="numbers__icon">
                  <BiCrown />
                </div>
                <div className="numbers__title">3 Million</div>
                <div className="numbers__sub--title">
                  Downloads on all platforms
                </div>
              </div>
              <div className="numbers">
                <div className="numbers__icon numbers__star--icon">
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarHalf />
                </div>
                <div className="numbers__title">4.5 Stars</div>
                <div className="numbers__sub--title">
                  Average ratings on iOS and Google Play
                </div>
              </div>
              <div className="numbers">
                <div className="numbers__icon">
                  <RiLeafLine />
                </div>
                <div className="numbers__title">97%</div>
                <div className="numbers__sub--title">
                  Of Summarist members create a better reading habit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}

      <section id="footer">
        <div className="row">
          <div className="container">
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
                    <a className="footer__link">Authors & Publishers</a>
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
                Copyright &copy; 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
