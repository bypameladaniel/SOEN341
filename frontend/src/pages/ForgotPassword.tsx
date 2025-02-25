import "../styles/ForgotPassword.css";
import {Mail} from "lucide-react";



const ForgotPassword = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Forgot Password?</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <Mail className="login-signup-icons" />
          <input type="email" placeholder="Email ID" />
        </div>
      </div>
      <div className="reset-container">
        <div className="submit">Send Email</div>
      </div>
    </div>
  );
};

export default ForgotPassword;
