import { useEffect, useState } from "react";
import MobileUniversity from "./mobileUniversity";
import DesktopUniversity from "./desktopUniversity";

const ResponsivePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1280);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileUniversity/> : <DesktopUniversity/>;
};

export default ResponsivePage;
