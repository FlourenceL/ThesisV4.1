import { useState } from "react";
import WeighingScale from "./WeighingScale";
import BodyScan from "./BodyScan";
import PersonalInfo from "./PersonalInfo";
import Height from "./Height";
import { Button } from "@mui/material";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  push,
} from "firebase/database";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/choose");
  };

  const db = getDatabase();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  // Firebase references
  const loadCellState = ref(db, "Loadcell/state");
  const loadCellData = ref(db, "Loadcell/data");
  const ultraSonicState = ref(db, "Ultrasonic/state");
  const ultraSonicData = ref(db, "Ultrasonic/data");

  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: 0,
  });

  const formTitles = ["Personal Info", "Body Weight", "Height", "Body Scan"];

  const pageDisplay = () => {
    if (page === 0) {
      return <PersonalInfo formData={formData} setFormData={setFormData} />;
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

    // Format the date to MM-DD-YYYY
    const formattedDate = `${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today
      .getDate()
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;

    // Update the formData with the current weight and height
    const updatedFormData = {
      ...formData,
      createdAt: formattedDate,
    };

    // Reference the "Users" node in your database
    const usersRef = ref(db, "Users");

    try {
      const newUserRef = push(usersRef); // This generates a unique key for each new user
      await set(newUserRef, updatedFormData);
      console.log("User data submitted successfully!");

      // Save progress in a separate node
      const progressRef = ref(db, `Users/${newUserRef.key}/Progress`); // Reference to the user's Progress node
      const newProgressRef = push(progressRef); // Generate a unique key for progress
      await set(newProgressRef, {
        weight: weight,
        height: height,
        createdAt: formattedDate,
      });
      console.log("Progress data submitted successfully!");

      // Clean up: Delete the loadCellData and ultraSonicData after saving
      await set(loadCellData, 0); // Deleting Loadcell data
      await set(ultraSonicData, 0); // Deleting Ultrasonic data

      // Reset formData
      setFormData({
        firstName: "",
        lastName: "",
        age: 0,
      });
      setWeight(""); // Reset weight
      setHeight(""); // Reset height

      handleNavigate();

      console.log("Loadcell and Ultrasonic data cleared after submission.");
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  return (
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
                  } else if (page !== 0) {
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
  );
}

export default Form;
