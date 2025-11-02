"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll position to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior, // Use instant instead of smooth for faster reset
    });

    // Dispatch custom event to close mobile menu
    window.dispatchEvent(new CustomEvent("closeMobileMenu"));
  }, [pathname]);

  return null;
}
