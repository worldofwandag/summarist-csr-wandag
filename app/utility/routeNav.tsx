/**
 * Replaces the current route based on the current path.
 * @param router - The Next.js Router object.
 */
export const routeNav = (router: any): void => {
    const currentPath = window.location.pathname;
  
    if (currentPath === "/") {
      router.push("/for-you"); // Navigate to "For You" page
    } else if (currentPath.startsWith("/book/")) {
      router.push(currentPath); // Stay on the current book page
    } else if (currentPath.startsWith("/settings")) {
      router.push(currentPath); // Stay on the current book page
    } else {
      router.push("/for-you"); // Default fallback
    }
  };