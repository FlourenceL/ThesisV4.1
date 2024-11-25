import { useState } from "react";
import WeighingScale from "./WeighingScale";
import BodyScan from "./BodyScan";
import PersonalInfo from "./PersonalInfo";
import Height from "./Height";
import Overall from "./Overall";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
} from "@mui/material";

import firebaseConfig from "./firebaseConfig";
import {
  getDatabase,
  ref,
  onValue,
  set,
  onDisconnect,
  push,
} from "firebase/database";
import { useNavigate } from "react-router-dom";

function Form({ bmiCategory }) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/choose");
  };

  const home = () => {
    navigate("/");
  };

  const calculateBMI = (weight, height) => {
    if (height > 0) {
      return parseFloat((weight / (height / 100) ** 2).toFixed(2)); // Convert height to meters and limit to 2 decimal places
    }
    return 0;
  };

  const determineBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obesity";
  };

  const db = getDatabase();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fat, setFat] = useState("");
  const [gender, setGender] = useState("");

  // Firebase references
  const loadCellState = ref(db, "Loadcell/state");
  const loadCellData = ref(db, "Loadcell/data");
  const ultraSonicState = ref(db, "Ultrasonic/state");
  const ultraSonicData = ref(db, "Ultrasonic/data");
  const fatData = ref(db, "Bodyfat/data");

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    birthdate: null,
    firstName: "",
    lastName: "",
    gender: gender,
    age: "",
  });

  const formTitles = [
    "Personal Info",
    "Body Weight",
    "Height",
    "Body Scan",
    "Overall",
  ];

  const pageDisplay = () => {
    if (activeStep === 0) {
      return <PersonalInfo formData={formData} setFormData={setFormData} />;
    } else if (activeStep === 1) {
      return <WeighingScale weight={weight} setWeight={setWeight} />;
    } else if (activeStep === 2) {
      return <Height height={height} setHeight={setHeight} />;
    } else if (activeStep === 3) {
      return <BodyScan fat={fat} setFat={setFat} />;
    } else if (activeStep === 4) {
      return <Overall weight={weight} height={height} fat={fat} />;
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !formData.firstName || !formData.lastName || formData.age <= 0;
    }

    return activeStep === 1 && (!weight || weight <= 0);
  };

  const tryAgainDisable = () => {
    if (activeStep === 1 && (weight === "" || weight === 0)) return true; // Disable if weight is empty or zero
    if (activeStep === 2 && (height === "" || height === 0)) return true;
  };

  //-----------------------------------ALERT BUTTON-----------------------------------
  const [showAlert, setShowAlert] = useState(false);
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [showDialog3, setShowDialog3] = useState(false);
  const [showTryAgainDialog, setShowTryAgainDialog] = useState(false);
  const handleShowAlert = () => {
    setShowTryAgainDialog(true);
    // Set the state to true when the component is mounted
    if (activeStep === 1) {
      set(loadCellState, false);
    } else if (activeStep === 2) {
      set(ultraSonicState, false);
    }
  };
  const handleShowDialog1 = () => {
    setShowDialog1(true); // Show dialog instead of alert
  };

  const handleShowDialog2 = () => {
    setShowDialog2(true); // Show dialog instead of alert
  };

  const handleShowDialog3 = () => {
    setShowDialog3(true); // Show dialog instead of alert
  };

  const handleYesTryAgain = () => {
    setShowTryAgainDialog(false);
    if (activeStep === 1) {
      set(loadCellState, true);
      set(loadCellData, 0);
    } else if (activeStep === 2) {
      set(ultraSonicState, true);
      set(ultraSonicData, 0);
    }
  };

  const handleNoTryAgain = () => {
    setShowTryAgainDialog(false);
    if (activeStep === 1) {
      set(loadCellState, false);
    } else if (activeStep === 2) {
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

    const bmi = calculateBMI(weight, height);
    const bmiCategory = determineBMICategory(bmi);

    // Update the formData with the current weight and height
    const updatedFormData = {
      ...formData,
      birthdate: formData.birthdate?.format("YYYY-MM-DD") || "",
      createdAt: formattedDate,
      bmiCategory: bmiCategory,
      bmi: bmi,
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
        fat: fat,
        bmiCategory,
        bmi: bmi,
        createdAt: formattedDate,
      });
      console.log("Progress data submitted successfully!");

      // Clean up: Delete the loadCellData and ultraSonicData after saving
      await set(loadCellData, 0); // Deleting Loadcell data
      await set(ultraSonicData, 0); // Deleting Ultrasonic data
      await set(fatData, 0);

      // Reset formData
      setFormData({
        firstName: "",
        lastName: "",
        age: 0,
      });
      setWeight(""); // Reset weight
      setHeight(""); // Reset height
      setFat("");

      home();

      console.log(
        "Loadcell, Ultrasonic and Fat Scanner data cleared after submission."
      );
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };
  const buttonText = activeStep === 0 ? "Cancel" : "Try Again";

  return (
    <div className="form">
      <div className="progress-bar">
        <div className="form-container">
          <div className="header">
            <h1>{formTitles[activeStep]}</h1>
          </div>
          <Stepper activeStep={activeStep} alternativeLabel>
            {formTitles.map((title, index) => (
              <Step key={index}>
                <StepLabel>{title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="body">{pageDisplay()}</div>
          <div className="footer">
            <section>
              {activeStep !== formTitles.length - 1 && activeStep !== 3 && (
                <Button
                  sx={{
                    position: "fixed", // Make the buttons fixed to the bottom
                    bottom: 16, // Distance from the bottom edge
                    left: "7%", // Position the Cancel button on the left
                    transform: "translateX(0%)",
                    zIndex: 10,
                    "@media (max-width: 600px)": {
                      left: "5%", // Adjust position for mobile screens
                    },
                  }}
                  variant="contained"
                  disabled={tryAgainDisable()}
                  onClick={() => {
                    if (activeStep === 0) {
                      handleNavigate();
                    } else if (activeStep === 1 || activeStep === 2) {
                      handleShowAlert();
                    }
                  }}
                >
                  {buttonText}
                </Button>
              )}

              <Dialog
                open={showTryAgainDialog}
                onClose={() => setShowTryAgainDialog(false)}
              >
                <DialogTitle>
                  <Box display="flex" alignItems="center">
                    Warning!
                    <WarningIcon style={{ marginLeft: 8, color: "orange" }} />
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Would you like to try again?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={handleYesTryAgain}>
                    Yes
                  </Button>
                  <Button variant="outlined" onClick={handleNoTryAgain}>
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            </section>

            <Button
              sx={{
                position: "fixed", // Make the buttons fixed to the bottom
                bottom: 16, // Distance from the bottom edge
                right: "10%", // Position the Next button on the right
                transform: "translateX(0%)",
                zIndex: 10,
                "@media (max-width: 600px)": {
                  right: "5%", // Adjust position for mobile screens
                },
              }}
              variant="contained"
              disabled={isNextDisabled()}
              onClick={() => {
                if (activeStep === 0) {
                  handleShowDialog1(); // Show dialog instead of moving to next step
                } else if (activeStep === 1) {
                  handleShowDialog2();
                } else if (activeStep === 2) {
                  handleShowDialog3();
                } else if (activeStep === formTitles.length - 1) {
                  handleSubmit();
                } else {
                  setActiveStep((prevStep) => prevStep + 1);
                }
              }}
            >
              {activeStep === formTitles.length - 1 ? "Submit" : "Next"}
            </Button>

            <Dialog open={showDialog1} onClose={() => setShowDialog1(false)}>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  Warning!
                  <WarningIcon
                    style={{ marginLeft: 8, color: "orange" }}
                  />{" "}
                  {/* Icon with left margin */}
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {" "}
                  {/* Warning icon with some style */}
                  Step off the scale, press Next, then step back on.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowDialog1(false);
                    setActiveStep((prevStep) => prevStep + 1); // Proceed to the next step
                  }}
                  color="primary"
                >
                  Next
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={showDialog2} onClose={() => setShowDialog2(false)}>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  Warning!
                  <WarningIcon
                    style={{ marginLeft: 8, color: "orange" }}
                  />{" "}
                  {/* Icon with left margin */}
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {" "}
                  {/* Warning icon with some style */}
                  Please step onto the platform, stand straight, and align
                  yourself with the sensor.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowDialog2(false);
                    setActiveStep((prevStep) => prevStep + 1); // Proceed to the next step
                  }}
                  color="primary"
                >
                  Next
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={showDialog3} onClose={() => setShowDialog3(false)}>
              <DialogTitle>
                <Box display="flex" alignItems="center">
                  Warning!
                  <WarningIcon
                    style={{ marginLeft: 8, color: "orange" }}
                  />{" "}
                  {/* Icon with left margin */}
                </Box>
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {" "}
                  {/* Warning icon with some style */}
                  Ensure your midsection is visible to the camera for an
                  accurate body fat scan.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowDialog3(false);
                    setActiveStep((prevStep) => prevStep + 1); // Proceed to the next step
                  }}
                  color="primary"
                >
                  Next
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
