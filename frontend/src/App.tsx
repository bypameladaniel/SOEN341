
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GroupSidebar from "./components/Sidebar/group-sidebar"
import DirectSidebar from "./components/Sidebar/DM-sidebar"
import LoginSignup from "./components/login-signup/LoginSignup"
import ResetPassword from "./components/password/ResetPassword"
import ForgotPassword from "./components/password/ForgotPassword"
import Profile from "./components/profile-page/profile"
import Settings from "./components/settings-page/settings"
import Layout from "./components/layout";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
  <Route path="/" element={<Layout/>}>
    <Route path="login-signup" element={<LoginSignup/>}/>
    <Route path="Settings" element={<Settings />}/>
    <Route path="Profile" element={<Profile />}/>
    <Route path="forgotpassword" element={<ForgotPassword/>}/>
    <Route path="resetpassword" element={<ResetPassword/>}/>
  </Route>

  {/* Separate Routes for Sidebars (Not inside Layout) */}
  <Route path="GroupSidebar" element={<GroupSidebar />} />
  <Route path="DirectSidebar" element={<DirectSidebar />} />
  </Routes>
  </BrowserRouter>
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App/>);
export default App