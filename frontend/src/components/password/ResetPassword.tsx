import "./ResetPassword.css";

const ResetPassword = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Reset Password</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <input type="password" placeholder="Enter new password" />
        </div>
        <div className="input">
          <input type="password" placeholder="Confirm new password" />
        </div>
      </div>
      <div className="reset-container">
        <div className="submit">Reset</div>
      </div>
    </div>
  );
};

export default ResetPassword;
