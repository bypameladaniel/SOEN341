import { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm";

type AuthPageProps = {
  initialMethod: "login" | "signup";
};

const AuthPage: React.FC<AuthPageProps> = ({ initialMethod }) => {
  const [method, setMethod] = useState<"login" | "signup">(initialMethod);

  useEffect(() => {
    setMethod(initialMethod);
  }, [initialMethod]);

  const route = method === "login" ? "/api/token/" : "/api/user/register/";

  return (
    <div>
      <AuthForm route={route} method={method} />
    </div>
  );
};

export default AuthPage;
