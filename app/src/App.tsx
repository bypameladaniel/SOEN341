import { BrowserRouter, Routes, Route} from "react-router-dom";
// import {useAuthentication} from "./auth.ts";
import ResetPassword from "./components/login-signup/ResetPassword"
import ForgotPassword from "./components/login-signup/ForgotPassword"
import Layout from "./components/layout";
// import AuthPage from "./components/login-signup/AuthPage.jsx";

const App = () => {
  // const {isAuthorized} = useAuthentication()
  // const ProtectedLogin = () => {
  //   return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='login' />
  // }
  // const ProtectedRegister = () => {
  //   return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='signup' />
  // }

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* <Route path="authentication" element={<AuthPage></AuthPage>}></Route> */}
        {/* <Route path="/login" element={<ProtectedLogin />}/>
        <Route path="/signup" element={<ProtectedRegister />}/> */}
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