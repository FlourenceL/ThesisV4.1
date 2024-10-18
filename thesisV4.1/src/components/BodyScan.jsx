import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BodyScan() {
  return (
    <>
      <div>
        <h1>Body Scan</h1>
        <img
          src="http://localhost:5000/video_feed"
          alt="Live Feed"
          style={{ width: "100%", maxWidth: "600px", height: "auto" }}
        />
      </div>
    </>
  );
}

export default BodyScan;
