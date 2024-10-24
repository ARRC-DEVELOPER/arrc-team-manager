import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../main";

const GoogleCallback = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");

      if (authCode) {
        try {
          const response = await axios.post(
            `${server}/auth/google/callback`,
            {
              code: authCode,
            },
            {
              headers: { Authorization: `Bearer ${authToken}` },
              withCredentials: true,
            }
          );

          const { user, token } = response.data;
          localStorage.setItem("authToken", token);
          onLogin(user);
          navigate("/dashboard");
        } catch (error) {
          console.error("Google OAuth callback error:", error);
          navigate("/login");
        }
      }
    };

    handleAuthCallback();
  }, [navigate, onLogin]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
