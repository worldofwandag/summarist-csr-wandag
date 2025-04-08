import React from "react";
import Selected from "../components/Selected";
import Recommended from "../components/Recommended";
import Suggested from "../components/Suggested";

const Page = () => {
  return (
    <>
      <div className="wrapper">
        <div className="sidebar__overlay sidebar__overlay--hidden" />
        <div className="row">
          <div className="container">
            <div className="for-you__wrapper">
              <Selected />
              <Recommended />
              <Suggested />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;