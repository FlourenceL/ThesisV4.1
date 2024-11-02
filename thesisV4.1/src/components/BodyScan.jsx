import React, { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
} from "firebase/database";

const BodyScan = () => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [countdown, setCountdown] = useState(null); // State for countdown

  useEffect(() => {
    // Load the video feed URL if the camera is on
    if (isCameraOn && videoRef.current) {
      videoRef.current.src = "http://localhost:5000/video_feed"; // Adjust for server address if needed
    } else if (videoRef.current) {
      videoRef.current.src = ""; // Clear the src to stop the feed
    }
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      await fetch("http://localhost:5000/start_camera"); // Adjust for server address if needed
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    setCapturedImage(null); // Clear captured image when camera is turned off
    setCountdown(null); // Clear countdown when camera is turned off
  };

  const captureImage = async () => {
    setCountdown(5); // Start countdown

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval); // Clear interval
          return null; // Reset countdown state
        }
        return prev - 1; // Decrease countdown
      });
    }, 1000); // Update countdown every second

    // Wait for the countdown to finish before capturing the image
    setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:5000/capture_image"); // Adjust for server address if needed
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setCapturedImage(imageObjectURL);
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    }, 5000); // Capture image after 5 seconds
  };

  const [fat, setFat] = useState("");

  const db = getDatabase();

  useEffect(() => {
    const Bodyfatref = ref(db, "Bodyfat/data");

    onDisconnect(Bodyfatref).set("");

    // Listen for real-time updates on the "Ultrasonic/data"
    const unsubscribe = onValue(Bodyfatref, (snapshot) => {
      const fatValue = snapshot.val();
      setFat(fatValue);
    });

    // Cleanup function to set the state to false when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, [db, setFat]);

  return (
    <div>
      <h1>Camera Feed</h1>
      <TextField
        id="outlined-read-only-input"
        label="Body Fat"
        value={fat}
        onChange={(e) => setInputValue(e.target.value)}
        InputProps={{
          readOnly: true,
        }}
      />
      {isCameraOn ? (
        <img
          ref={videoRef}
          alt="Camera Feed"
          style={{ width: "100%", maxWidth: "640px" }}
        />
      ) : (
        <p>Camera is off</p>
      )}
      <Button variant="contained" onClick={startCamera} disabled={isCameraOn}>
        Turn On Camera
      </Button>
      <Button variant="contained" onClick={stopCamera} disabled={!isCameraOn}>
        Turn Off Camera
      </Button>
      <Button variant="contained" onClick={captureImage} disabled={!isCameraOn}>
        Capture Image
      </Button>
      {countdown !== null && <h2>Capturing in {countdown}...</h2>}{" "}
      {/* Display countdown */}
      {capturedImage && (
        <div>
          <h2>Captured Image</h2>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", maxWidth: "640px" }}
          />
        </div>
      )}
    </div>
  );
};

export default BodyScan;
