"use client";

import { useEffect, useState } from "react";

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export function DynamicLayout({ children }: DynamicLayoutProps) {
  const [navHeight, setNavHeight] = useState(144); // Default height

  useEffect(() => {
    const updateHeight = () => {
      const navElement = document.querySelector('nav');
      if (navElement) {
        const height = navElement.offsetHeight;
        setNavHeight(height);
      }
    };

    const handleNavigationHeightChange = (event: CustomEvent) => {
      setNavHeight(event.detail.height);
    };

    // Listen for navigation height changes
    window.addEventListener('navigationHeightChange', handleNavigationHeightChange as EventListener);
    
    // Also listen for scroll events as a fallback
    const handleScroll = () => {
      // Debounce the height update
      setTimeout(updateHeight, 100);
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Initial height calculation
    const updateInitialHeight = () => {
      updateHeight();
    };

    // Wait for navigation to render, then update height
    setTimeout(updateInitialHeight, 100);
    
    // Also update height after a longer delay to ensure all transitions are complete
    setTimeout(updateHeight, 500);

    return () => {
      window.removeEventListener('navigationHeightChange', handleNavigationHeightChange as EventListener);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main 
      style={{ paddingTop: `${navHeight}px` }} 
      className="transition-all duration-500 ease-in-out"
    >
      {children}
    </main>
  );
}
