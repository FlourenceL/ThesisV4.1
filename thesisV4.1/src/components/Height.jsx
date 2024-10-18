import { useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
} from "firebase/database";

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

  return (
    <center>
      <label>Height: </label>
      <input type="text" readOnly value={height} />
    </center>
  );
}

export default Height;
