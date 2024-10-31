import React, { useEffect, useRef, useState } from "react";

const BodyScan = () => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzedImage, setAnalyzedImage] = useState(null);

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
    setAnalyzedImage(null); // Clear analyzed image when camera is turned off
  };

  const captureImage = async () => {
    try {
      const response = await fetch("http://localhost:5000/capture_image"); // Adjust for server address if needed
      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setCapturedImage(imageObjectURL);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    try {
      const formData = new FormData();
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      formData.append("image", blob, "captured.jpg");

      const result = await fetch("http://localhost:5000/analyze_image", {
        method: "POST",
        body: formData,
      });

      const analyzedBlob = await result.blob();
      const analyzedObjectURL = URL.createObjectURL(analyzedBlob);
      setAnalyzedImage(analyzedObjectURL);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  return (
    <div>
      <h1>Camera Feed</h1>
      {isCameraOn ? (
        <img
          ref={videoRef}
          alt="Camera Feed"
          style={{ width: "100%", maxWidth: "640px" }}
        />
      ) : (
        <p>Camera is off</p>
      )}
      <button onClick={startCamera} disabled={isCameraOn}>
        Turn On Camera
      </button>
      <button onClick={stopCamera} disabled={!isCameraOn}>
        Turn Off Camera
      </button>
      <button onClick={captureImage} disabled={!isCameraOn}>
        Capture Image
      </button>
      {capturedImage && (
        <div>
          <h2>Captured Image</h2>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", maxWidth: "640px" }}
          />
          <button onClick={analyzeImage}>Analyze Image</button>
        </div>
      )}
      {analyzedImage && (
        <div>
          <h2>Analyzed Image</h2>
          <img
            src={analyzedImage}
            alt="Analyzed"
            style={{ width: "100%", maxWidth: "640px" }}
          />
        </div>
      )}
    </div>
  );
};

export default BodyScan;
