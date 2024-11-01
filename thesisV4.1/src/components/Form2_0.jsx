import Form2 from "./Form2";
import { useState } from "react";
import WeighingScale from "./WeighingScale";
import BodyScan from "./BodyScan";
import { Button } from "@mui/material";
import Height from "./Height";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  push,
} from "firebase/database";
import { useNavigate } from "react-router-dom";

function Form2_0() {
  const [selectedUserId, setSelectedUserId] = useState(""); // Store selected user ID
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/choose");
  };
  const home = () => {
    navigate("/");
  };
  const db = getDatabase();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const loadCellState = ref(db, "Loadcell/state");
  const loadCellData = ref(db, "Loadcell/data");
  const ultraSonicState = ref(db, "Ultrasonic/state");
  const ultraSonicData = ref(db, "Ultrasonic/data");
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    weight: 0,
    height: 0,
  });

  const formTitles = ["Personal Info", "Body Weight", "Height", "Body Scan"];

  const pageDisplay = () => {
    if (page === 0) {
      return <Form2 setSelectedUserId={setSelectedUserId} />;
    } else if (page === 1) {
      return <WeighingScale weight={weight} setWeight={setWeight} />;
    } else if (page === 2) {
      return <Height height={height} setHeight={setHeight} />;
    } else if (page === 3) {
      return <BodyScan />;
    }
  };

  const isNextDisabled = () => {
    if (page === 1 && (weight === "" || weight === 0)) return true; // Disable if weight is empty or zero
    if (page === 2 && (height === "" || height === 0)) return true; // Disable if height is empty or zero
  };

  const tryAgainDisable = () => {
    if (page === 1 && (weight === "" || weight === 0)) return true; // Disable if weight is empty or zero
    if (page === 2 && (height === "" || height === 0)) return true;
  };

  //-----------------------------------ALERT BUTTON-----------------------------------
  const [showAlert, setShowAlert] = useState(false);
  const handleShowAlert = () => {
    setShowAlert(true);

    // Set the state to true when the component is mounted
    if (page === 1) {
      set(loadCellState, false);
    } else if (page === 2) {
      set(ultraSonicState, false);
    }
  };

  const handleYes = () => {
    alert("You clicked Yes!");
    setShowAlert(false);
    // Set the state to true when the component is mounted
    if (page === 1) {
      set(loadCellState, true);
      set(loadCellData, 0);
    } else if (page === 2) {
      set(ultraSonicState, true);
      set(ultraSonicData, 0);
    }
  };

  const handleNo = () => {
    alert("You clicked No!");
    setShowAlert(false);
    if (page === 1) {
      set(loadCellState, false);
    } else if (page === 2) {
      set(ultraSonicState, false);
    }
  };

  const handleSubmit = async () => {
    const today = new Date();
    const formattedDate = `${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today
      .getDate()
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;

    // Update the formData with the current weight and height
    const updatedFormData = {
      weight: weight,
      height: height,
      createdAt: formattedDate,
    };

    // Reference the "Users" node in your database using selectedUserId
    const userProgressRef = ref(db, `Users/${selectedUserId}/Progress`); // Point to Progress node

    try {
      const newProgressRef = push(userProgressRef); // Generate a new unique key
      await set(newProgressRef, updatedFormData); // Save the new data under the generated key
      console.log("User progress submitted successfully!");

      // Clean up: Delete the loadCellData and ultraSonicData after saving
      await set(loadCellData, 0); // Deleting Loadcell data
      await set(ultraSonicData, 0); // Deleting Ultrasonic data

      setFormData({
        weight: 0,
        height: 0,
      });

      handleNavigate();
    } catch (error) {
      console.error("Error submitting user progress:", error);
    }
  };

  return (
    <>
      <div className="form">
        <div className="progress-bar">
          <div className="form-container">
            <div className="header">
              <h1>{formTitles[page]}</h1>
            </div>
            <div className="body">{pageDisplay()}</div>
            <div className="footer">
              <Button
                variant="contained"
                disabled={page === 0}
                onClick={() => {
                  setPage((currPage) => currPage - 1);
                }}
              >
                Prev
              </Button>
              <section>
                <Button
                  variant="contained"
                  disabled={tryAgainDisable()}
                  onClick={() => {
                    if (page === 0) {
                      handleNavigate();
                    } else if (page != 0) {
                      handleShowAlert();
                    }
                  }}
                >
                  {page === 0 ? "Cancel" : "Try again"}
                </Button>
                {showAlert && (
                  <div className="alert">
                    <div className="alert-content">
                      <span className="alert-message">
                        Would you like to try again?
                      </span>
                      <Button variant="contained" onClick={handleYes}>
                        Yes
                      </Button>
                      <Button variant="contained" onClick={handleNo}>
                        No
                      </Button>
                    </div>
                  </div>
                )}
              </section>
              <Button
                variant="contained"
                disabled={isNextDisabled()}
                onClick={() => {
                  if (page === formTitles.length - 1) {
                    handleSubmit();
                  } else {
                    setPage((currPage) => currPage + 1);
                  }
                }}
              >
                {page === formTitles.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form2_0;
