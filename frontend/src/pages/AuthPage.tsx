import { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm";

type AuthPageProps = {
  initialMethod: "Login" | "Sign Up";
};

const AuthPage: React.FC<AuthPageProps> = ({ initialMethod }) => {
  const [method, setMethod] = useState<"Login" | "Sign Up">(initialMethod);

  useEffect(() => {
    setMethod(initialMethod);
  }, [initialMethod]);

  const route = method === "Login" ? "/app/token/" : "/app/user/register/";

  return (
    <div>
      <AuthForm route={route} method={method} />
    </div>
  );
};

export default AuthPage;
