import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
  <div>
    <Link to="/GroupSidebar"></Link>
  </div>
    {/* *
      <nav>
        <ul>
          
          
          {/* *
          <li>
            <Link to="/">Authentification</Link>
          </li>
          <li>
            <Link to="settings">Settings</Link>
          </li>
          <li>
            <Link to="/forgotpassword">Forgot Password</Link>
          </li>
          <li>
            <Link to="/resetpassword">Reset Password</Link>
          </li>
          
        </ul>
      </nav>
      */}
      

      <Outlet />
    </>
  )
};

export default Layout;