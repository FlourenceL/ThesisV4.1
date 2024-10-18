import { useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
} from "firebase/database";

function WeighingScale({ weight, setWeight }) {
  const db = getDatabase();
  useEffect(() => {
    if (!db) return;

    const weighingScaleDataRef = ref(db, "Loadcell/data");
    const stateRef = ref(db, "Loadcell/state");

    // Set the state to true when the component is mounted
    set(stateRef, true);

    // Automatically set the state to false and the data to 0 if the connection is lost (e.g., page refresh)
    onDisconnect(stateRef).set(false);
    onDisconnect(weighingScaleDataRef).set(0);

    // Listen for real-time updates on the "Loadcell/data"
    const unsubscribe = onValue(weighingScaleDataRef, (snapshot) => {
      const weightValue = snapshot.val();
      setWeight(weightValue);
    });

    // Cleanup function to set the state to false when the component is unmounted
    return () => {
      set(stateRef, false);
      unsubscribe();
    };
  }, [db, setWeight]);

  return (
    <form>
      <center>
        <label>Body weight: </label>
        <input type="text" name="weight" id="weight" readOnly value={weight} />
      </center>
    </form>
  );
}

export default WeighingScale;
