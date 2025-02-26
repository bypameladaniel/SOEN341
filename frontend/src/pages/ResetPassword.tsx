import { FormEvent, useState } from "react";
import "../styles/ResetPassword.css";
import api from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { REFRESH_TOKEN } from "../token";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const username = searchParams.get("username");
  const token = searchParams.get(REFRESH_TOKEN);
  console.log(token);
  console.log(username);

  const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();

      const url = "http://localhost:8000/app/change-password/";
      console.log(token);
      console.log(username);
      console.log(password);
      const res = await api.post(url, {
          new_password: password,
          token: token,
          username: username,
      });
      if (res.data.success === false) {
          toast.error(res.data.message, {
              autoClose: 5000,
              position: "top-right",
          });
      } else {
          toast.success(res.data.message, {
              autoClose: 5000,
              position: "top-right",
          });
          setTimeout(() => {
              navigate("/login");
          }, 2000);
        }
  };
  return (
    <div className="container">
      <div className="header">
        <div className="text">Reset Password</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <div className="input">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="reset-container">
          <button type="submit" className="submit">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
