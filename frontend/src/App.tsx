import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useAuthentication} from "./auth.ts";
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"
// import { Home } from "lucide-react";
import Layout from "./components/layout.tsx";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

const App = () => {
  const {isAuthorized} = useAuthentication()
  const ProtectedLogin = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='Login' />
  }
  const ProtectedRegister = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='Sign Up' />
  }

  return (
    <div>
      <BrowserRouter>
      {/*insert sidebar here? */}
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="authentication" element={<AuthPage initialMethod="Login"></AuthPage>}></Route>
          <Route path="/login" element={<ProtectedLogin />}/>
          <Route path="/signup" element={<ProtectedRegister />}/>
          <Route path="*" element={<NotFound/>}/>
          <Route path="forgotpassword" element={<ForgotPassword/>}/>
          <Route path="resetpassword" element={<ResetPassword/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>

  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App/>);
export default App