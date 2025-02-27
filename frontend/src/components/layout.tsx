import { Outlet } from "react-router-dom";
import GroupSidebar from "./Sidebar/group-sidebar"; 

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <GroupSidebar />

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
