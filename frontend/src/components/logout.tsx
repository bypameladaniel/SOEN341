import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";

const logout = async () => {
  try {
    // Send the logout request
    await api.post("http://localhost:8000/app/logout/", {
      refresh: localStorage.getItem(REFRESH_TOKEN),
    });

    // Clear tokens only if the request succeeds
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
  } catch (error) {
    console.error("Logout failed:", error);
    // Handle the error (e.g., show a notification to the user)
  }
};

export default logout;
