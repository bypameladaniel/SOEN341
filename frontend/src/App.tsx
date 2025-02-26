import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useAuthentication} from "./auth.ts";
// import { Home } from "lucide-react";
import Layout from "./components/layout.tsx";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm.tsx";

const App = () => {

  return (
    <div>
      <BrowserRouter>
      {/*insert sidebar here? */}
      <Routes>
        <Route path="/" element={<Layout/>}>
          
          <Route path="authentication" element={<AuthForm method="Sign Up"></AuthForm>}></Route>
          <Route path="*" element={<NotFound/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>

  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App/>);
export default App