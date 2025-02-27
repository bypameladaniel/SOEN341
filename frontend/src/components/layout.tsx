import { Outlet, Link } from "react-router-dom";
import logout from "./logout";

const Layout = () => {

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/authentication">Authentication</Link>
          </li>
          <li>
            <Link to="/forgotpassword">Forgot Password</Link>
          </li>
          <li>
            <Link to="/resetpassword">Reset Password</Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;