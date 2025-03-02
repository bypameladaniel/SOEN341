import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isSidebarPage = location.pathname.includes("groupsidebar") || location.pathname.includes("directsidebar");

  return (
    <div style={{ display: "flex" }}>
      {/* Show Sidebar only on group/direct pages */}
      {isSidebarPage && <Outlet />}
      
      {/* Main Content */}
      {!isSidebarPage && (
        <div style={{ flexGrow: 1 }}>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Layout;


