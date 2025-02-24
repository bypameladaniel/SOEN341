import Profile from "./components/profile-page/profile"
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSignup from "./components/login-signup/LoginSignup"
import ResetPassword from "./components/password/ResetPassword"
import ForgotPassword from "./components/password/ForgotPassword"
import Layout from "./components/layout";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}> //Mia is doing the layout?
        <Route index element={<LoginSignup/>}/>
        <Route path="forgotpassword" element={<ForgotPassword/>}/>
        <Route path="resetpassword" element={<ResetPassword/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App/>);
export default App