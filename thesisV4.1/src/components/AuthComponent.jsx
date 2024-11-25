import React, { useState } from "react";
import { Button, Slide, Box } from "@mui/material";
import Form from "./Form"; // Import your log-in form component
import Form2_0 from "./Form2_0"; // Import your registration form component

const AuthComponent = () => {
  const [showLogin, setShowLogin] = useState(true); // to toggle between Login and Register

  const toggleAuthView = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      position="relative"
      overflow="hidden"
      width="100%"
    >
      {/* Login Component */}
      <Slide
        direction={showLogin ? "right" : "left"}
        in={showLogin}
        mountOnEnter
        unmountOnExit
      >
        <Box
          width="300px"
          height="300px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          bgcolor="primary.main"
          color="white"
          p={3}
          borderRadius={2}
        >
          <Form /> {/* Display log-in form */}
          <Button variant="contained" onClick={toggleAuthView} sx={{ mt: 2 }}>
            Switch to Register
          </Button>
        </Box>
      </Slide>

      {/* Register Component */}
      <Slide
        direction={showLogin ? "right" : "left"}
        in={!showLogin}
        mountOnEnter
        unmountOnExit
      >
        <Box
          width="300px"
          height="300px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          bgcolor="secondary.main"
          color="white"
          p={3}
          borderRadius={2}
        >
          <Form2_0 /> {/* Display register form */}
          <Button variant="contained" onClick={toggleAuthView} sx={{ mt: 2 }}>
            Switch to Log In
          </Button>
        </Box>
      </Slide>
    </Box>
  );
};

export default AuthComponent;
