// src/security.js
import axios from "axios";

export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(
      '${process.env.REACT_APP_API_URL}/api/csrf-token',
      { withCredentials: true }
    );
    const csrfToken = response.data.token;

    if (csrfToken) {
      localStorage.setItem("CSRF_TOKEN", csrfToken);
      console.log("Fetched CSRF Token:", csrfToken);
    }

    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
};
