import React, { useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
} from "firebase/database";
import { TextField } from "@mui/material";

function WeighingScale({ weight, setWeight }) {
  const db = getDatabase();

  useEffect(() => {
    if (!db) return;

    const weighingScaleDataRef = ref(db, "Loadcell/data");
    const stateRef = ref(db, "Loadcell/state");

    set(stateRef, true);

    onDisconnect(stateRef).set(false);
    onDisconnect(weighingScaleDataRef).set(0);

    const unsubscribe = onValue(weighingScaleDataRef, (snapshot) => {
      const weightValue = snapshot.val();
      setWeight(weightValue);
    });

    return () => {
      set(stateRef, false);
      unsubscribe();
    };
  }, [db, setWeight]);

  return (
    <div style={{ textAlign: "center" }}>
      <TextField
        id="weight"
        label="Body Weight (KG)"
        value={parseFloat(weight).toFixed(2)}
        InputProps={{
          readOnly: true,
        }}
        style={{ marginBottom: "20px" }}
      />

      {/* Custom Gauge */}

      <div className="gauge">
        <div className="gauge-arc" />
        <div
          className="gauge-needle"
          style={{
            transform: `rotate(${
              Math.min(Math.max(weight, 0), 100) * 1.8 - 90
            }deg)`,
          }}
        />
        <div className="gauge-center" />
      </div>
    </div>
  );
}

export default WeighingScale;
