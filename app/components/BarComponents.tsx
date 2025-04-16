'use client';

import { usePathname } from 'next/navigation';
import Searchbar from './Searchbar';
import React, { useRef, useEffect } from 'react';
import Sidebar from './Sidebar';

const BarComponents: React.FC = () => {
  const pathname = usePathname();

  // Check for the root or choose-plan path
  const isRootOrChoosePlan = pathname === '/' || pathname === '/choose-plan';

  // Refs for Sidebar and Overlay
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Function to toggle Sidebar visibility
  const handleToggleSidebar = () => {
    

    if (sidebarRef.current) {
      if (sidebarRef.current.classList.contains("sidebar")) {
        sidebarRef.current.className = "sidebar--open"; // Replace with .sidebar--open
      } else {
        sidebarRef.current.className = "sidebar"; // Revert back to .sidebar
      }
    }

    if (overlayRef.current) {
      overlayRef.current.classList.toggle("sidebar__overlay--hidden");
    }
  };

  // Function to handle screen resize
  const handleResize = () => {
    if (window.innerWidth > 768) {
      // Revert sidebar to default class
      if (sidebarRef.current) {
        sidebarRef.current.className = "sidebar";
      }

      // Ensure overlay is hidden
      if (overlayRef.current) {
        overlayRef.current.classList.add("sidebar__overlay--hidden");
      }
    }
  };

  // Function to handle link clicks
  const handleLinkClick = () => {
    if (sidebarRef.current) {
      sidebarRef.current.className = "sidebar"; // Revert back to .sidebar
    }

    if (overlayRef.current) {
      overlayRef.current.classList.add("sidebar__overlay--hidden"); // Hide the overlay
    }
  };

  // Add event listener for resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Original functionality for pathing */}
      {!isRootOrChoosePlan && (
        <>
          <Searchbar handleToggleSidebar={handleToggleSidebar} />
          <Sidebar ref={sidebarRef} onLinkClick={handleLinkClick} />
        </>
      )}

      {/* Overlay */}
      {!isRootOrChoosePlan && (
        <div
          ref={overlayRef}
          className="sidebar__overlay sidebar__overlay--hidden"
        />
      )}

      {/* Toggle Button */}
      {!isRootOrChoosePlan && (
        <button
          className="sidebar__toggle--btn"
          onClick={handleToggleSidebar}
        >
          
        </button>
      )}
    </>
  );
};

export default BarComponents;