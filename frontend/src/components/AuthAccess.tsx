import { Navigate } from "react-router-dom";
import { useAuthentication } from "../authentication/auth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthorized } = useAuthentication();

  if (isAuthorized === null) {
    return <div>Loading...........</div>;
  }

  if (
    isAuthorized &&
    (window.location.pathname === "/login" || window.location.pathname === "/signup")
  ) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;