import { useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
} from "firebase/database";
import { TextField } from "@mui/material";

function Height({ height, setHeight }) {
  const db = getDatabase();

  useEffect(() => {
    const heightScaleDataRef = ref(db, "Ultrasonic/data");
    const stateRef = ref(db, "Ultrasonic/state");

    // Set the state to true when the component is mounted
    set(stateRef, true);

    // Automatically set the state to false and the data to 0 if the connection is lost (e.g., page refresh)
    onDisconnect(stateRef).set(false);
    onDisconnect(heightScaleDataRef).set(0);

    // Listen for real-time updates on the "Ultrasonic/data"
    const unsubscribe = onValue(heightScaleDataRef, (snapshot) => {
      const heightValue = snapshot.val();
      setHeight(heightValue);
    });

    // Cleanup function to set the state to false when the component is unmounted
    return () => {
      set(stateRef, false);
      unsubscribe();
    };
  }, [db, setHeight]);

  // Calculate the fill level for the gauge and clamp it between 0 and 100
  const minHeight = 130;
  const maxHeight = 200;
  const fillLevel = Math.max(
    0,
    Math.min(100, ((height - minHeight) / (maxHeight - minHeight)) * 100)
  );

  return (
    <center>
      <TextField
        id="height"
        label="Body Height (CM)"
        value={parseFloat(height).toFixed(2)}
        InputProps={{
          readOnly: true,
        }}
        style={{ marginBottom: "20px" }}
      />

      {/* Vertical Gauge */}
      <div style={styles.gaugeContainer}>
        <div style={{ ...styles.gaugeFill, height: `${fillLevel}%` }}></div>
        <div style={styles.gaugeOverlay}>
          <span style={styles.gaugeLabel}>200 cm</span>
          <span style={{ ...styles.gaugeLabel, top: "85%" }}>130 cm</span>
        </div>
      </div>
    </center>
  );
}

const styles = {
  gaugeContainer: {
    position: "relative",
    width: "40px",
    height: "200px",
    border: "2px solid #0078FF",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "20px",
  },
  gaugeFill: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    backgroundColor: "#00bfff",
    transition: "height 0.3s ease",
  },
  gaugeOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#0078FF",
    fontWeight: "bold",
  },
  gaugeLabel: {
    position: "absolute",
    top: "5%",
  },
};

export default Height;
