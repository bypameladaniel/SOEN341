import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const [showSidebarLink, setShowSidebarLink] = useState(true);

  const handleSidebarClick = () => {
    setShowSidebarLink(false);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Show the link only if it hasn't been clicked */}
      {showSidebarLink && (
        <Link to="/GroupSidebar" onClick={handleSidebarClick}>
          To sidebar
        </Link>
      )}

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

