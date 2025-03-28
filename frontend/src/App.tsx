import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import GroupChat from "./components/chat-page/GroupChat";
import DirectSidebar from "./components/Sidebar/DM-sidebar";
import Profile from "./components/profile-page/profile";
import Settings from "./components/settings-page/settings";
import HomePage from "./components/home-page/Home";
//import MessagingArea from "./components/messaging/";
import Layout from "./layout";
// import { useState } from "react";
import AuthForm from "./components/authentication/AuthForm";
import GroupSidebar from "./components/Sidebar/group-sidebar";
import DirectChat from "./components/chat-page/DirectChat";

const App = () => {
  const isAuthenticated = !localStorage.getItem("ACCESS_TOKEN");

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page is the first thing displayed */}
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<AuthForm method={"Login"} isAuthenticated={isAuthenticated}/>} />
        <Route path="signup" element={<AuthForm method={"Sign Up"} isAuthenticated={isAuthenticated} />} />

        {/* Protected Routes */}
        {isAuthenticated && (
          <>
            {/* Redirect to GroupSidebar after login */}
            <Route path="/app" element={<Navigate to="/app/groupsidebar" replace />} />

            {/* Main Layout for sidebar pages */}
            <Route path="/app" element={<Layout />}>
              <Route path="groupsidebar" element={<GroupSidebar />} />
              <Route path="directsidebar" element={<DirectSidebar />} />

            </Route>

            {/* Dynamic route for individual channels */}
            <Route path="/channels/:channelName" element={<GroupChat />} />

            {/* Dynamic route for direct chats */}
            <Route path="/conversations/:userId" element={<DirectChat />} />

            {/* Settings and Profile as separate pages */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

