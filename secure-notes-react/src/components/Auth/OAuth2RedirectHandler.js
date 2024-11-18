import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // library
import { useMyContext } from "../../store/ContextApi";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setIsAdmin } = useMyContext();

  useEffect(() => {
    // extract the token from url
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log("OAuth2RedirectHandler: Params:", params.toString());
    console.log("OAuth2RedirectHandler: Token:", token);

    // if token is present we will decode the token
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        localStorage.setItem('JWT_TOKEN', token);

        // create the user object
        const user = {
          // username is present at sub
          username: decodedToken.sub,
          roles: decodedToken.roles.split(','),
        };

        console.log("User Object:", user);
        localStorage.setItem('USER', JSON.stringify(user));

        // Update context state
        setToken(token);
        setIsAdmin(user.roles.includes('ADMIN'));

        // Delay navigation to ensure local storage operations complete
        setTimeout(() => {
          console.log("Navigating to /notes");
          navigate('/');
        }, 100); // 100ms delay
      } catch (error) {
        console.error('Token decoding failed:', error);
        navigate('/login');
      }
    } else {
      console.log("Token not found in URL, redirecting to login");
      navigate('/login');
    }
  }, [location, navigate, setToken, setIsAdmin]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
