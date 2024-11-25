import React, { useEffect, useRef, useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { getDatabase, ref, onValue, onDisconnect } from "firebase/database";

const BodyScan = ({ fat, setFat }) => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading screen

  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      videoRef.current.src = "http://localhost:5000/video_feed";
    } else if (videoRef.current) {
      videoRef.current.src = "";
    }
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      await fetch("http://localhost:5000/start_camera");
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    setCapturedImage(null);
    setCountdown(null);
  };

  const captureImage = async () => {
    setCountdown(5);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:5000/capture_image");
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setCapturedImage(imageObjectURL);
        setIsLoading(true); // Show loading screen after capture

        // Hide loading screen after 3 seconds
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    }, 5000);
  };

  const db = getDatabase();

  useEffect(() => {
    const Bodyfatref = ref(db, "Bodyfat/data");

    onDisconnect(Bodyfatref).set("");

    const unsubscribe = onValue(Bodyfatref, (snapshot) => {
      const fatValue = snapshot.val();
      setFat(fatValue);
    });

    return () => {
      unsubscribe();
    };
  }, [db, setFat]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      <TextField
        id="outlined-read-only-input"
        label="Body Fat"
        value={fat}
        InputProps={{
          readOnly: true,
        }}
        sx={{ mb: 3, width: "50%" }}
      />

      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ width: "100%", maxWidth: "640px", mb: 3 }}
      >
        {isCameraOn ? (
          <>
            <img ref={videoRef} alt="Camera Feed" style={{ width: "100%" }} />
            {countdown !== null && (
              <Typography
                variant="h3"
                color="white"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                {countdown}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Camera is off
          </Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={startCamera} disabled={isCameraOn}>
          Turn On Camera
        </Button>
        <Button variant="contained" onClick={stopCamera} disabled={!isCameraOn}>
          Turn Off Camera
        </Button>
        <Button
          variant="contained"
          onClick={captureImage}
          disabled={!isCameraOn}
        >
          Capture Image
        </Button>
      </Box>

      {isLoading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bgcolor="rgba(0, 0, 0, 0.7)"
          zIndex={1000}
        >
          <dotlottie-player
            src="https://lottie.host/65a2f604-fa0d-4041-b03f-e6bf33cf9e75/z78lsLXky6.json"
            background="transparent"
            speed="0.75"
            style={{ width: "100%", maxWidth: "450px", height: "auto" }}
            loop
            autoplay
          />
          <Typography variant="h6" color="white" mt={2}>
            Processing your image...
          </Typography>
        </Box>
      )}

      {capturedImage && !isLoading && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <Typography variant="h6" mb={1}>
            Captured Image
          </Typography>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", maxWidth: "640px", borderRadius: "8px" }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BodyScan;
