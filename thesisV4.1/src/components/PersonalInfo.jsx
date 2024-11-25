import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { update } from "firebase/database"; // Import Firebase update function
import { ref } from "firebase/database"; // Import ref function from Firebase
import dayjs from "dayjs";

const LetterKeyboard = ({ onKeyPress, onBackspace, onClose }) => {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  return (
    <Paper elevation={3} style={{ padding: "10px", marginTop: "10px" }}>
      <Grid container spacing={1}>
        {rows.map((row, rowIndex) => (
          <Grid container item key={rowIndex} justifyContent="center">
            {row.split("").map((letter) => (
              <Grid item key={letter}>
                <Button
                  variant="contained"
                  onClick={() => onKeyPress(letter)}
                  style={{ width: "40px", height: "40px", fontSize: "16px" }}
                >
                  {letter}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}
        <Grid container item justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              onClick={() => onKeyPress(" ")}
              style={{
                width: "100px",
                height: "40px",
                fontSize: "16px",
                marginRight: "10px",
              }}
            >
              Space
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={onBackspace}
              style={{
                width: "100px",
                height: "40px",
                fontSize: "16px",
                marginRight: "10px",
              }}
            >
              ←
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={onClose}
              style={{ width: "100px", height: "40px", fontSize: "16px" }}
            >
              Enter
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const NumberKeyboard = ({ onKeyPress, onBackspace, onClose }) => {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "←", "Enter"],
  ];

  return (
    <Paper elevation={3} style={{ padding: "10px", marginTop: "10px" }}>
      <Grid container spacing={1}>
        {numbers.map((row, rowIndex) => (
          <Grid container item key={rowIndex} justifyContent="center">
            {row.map((key) => (
              <Grid item key={key}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (key === "←") {
                      onBackspace();
                    } else if (key === "Enter") {
                      onClose();
                    } else {
                      onKeyPress(key);
                    }
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    fontSize: "16px",
                    margin: "2px",
                  }}
                >
                  {key}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

function PersonalInfo({ formData, setFormData, userId, dbRef }) {
  const [isLetterKeyboardVisible, setIsLetterKeyboardVisible] = useState(false);
  const [isNumberKeyboardVisible, setIsNumberKeyboardVisible] = useState(false);
  const [activeField, setActiveField] = useState("");

  const calculateAge = (birthdate) => {
    if (!birthdate || !birthdate.isValid()) return "";
    const today = dayjs();
    return today.diff(birthdate, "year");
  };

  const updateAgeInDatabase = (newAge) => {
    // Write the new age to Firebase under the user’s record
    update(ref(dbRef, `Users/${userId}`), {
      age: newAge, // Update age in Firebase
    }).catch((error) => {
      console.error("Error updating age in database:", error);
    });
  };

  const handleFocus = (field) => {
    setActiveField(field);
    if (field === "age") {
      setIsNumberKeyboardVisible(true);
      setIsLetterKeyboardVisible(false);
    } else {
      setIsLetterKeyboardVisible(true);
      setIsNumberKeyboardVisible(false);
    }
  };

  const handleKeyPress = (letter) => {
    setFormData((prevData) => ({
      ...prevData,
      [activeField]: prevData[activeField] + letter,
    }));
  };

  const handleBackspace = () => {
    setFormData((prevData) => ({
      ...prevData,
      [activeField]: prevData[activeField].toString().slice(0, -1),
    }));
  };

  const handleCloseKeyboard = () => {
    setIsLetterKeyboardVisible(false);
    setIsNumberKeyboardVisible(false);
    setActiveField("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <TextField
          id="outlined-first-name"
          label="First Name"
          variant="outlined"
          type="text"
          placeholder="First name..."
          value={formData.firstName}
          onFocus={() => handleFocus("firstName")}
          onChange={(event) =>
            setFormData({ ...formData, firstName: event.target.value })
          }
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {activeField === "firstName" && isLetterKeyboardVisible && (
          <LetterKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onClose={handleCloseKeyboard}
          />
        )}
        <TextField
          id="outlined-last-name"
          label="Last Name"
          variant="outlined"
          type="text"
          placeholder="Last name..."
          value={formData.lastName}
          onFocus={() => handleFocus("lastName")}
          onChange={(event) =>
            setFormData({ ...formData, lastName: event.target.value })
          }
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {activeField === "lastName" && isLetterKeyboardVisible && (
          <LetterKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onClose={handleCloseKeyboard}
          />
        )}
        <InputLabel id="demo-simple-select-label">Sex</InputLabel>
        <Select
          labelId="gender-select-label"
          id="gender-select"
          value={formData.gender}
          label="Sex"
          onChange={(event) =>
            setFormData({ ...formData, gender: event.target.value })
          }
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>

        <DatePicker
          sx={{ marginBottom: 2 }}
          label="Birthdate"
          value={formData.birthdate ? dayjs(formData.birthdate) : null} // Ensure a valid dayjs object or null
          onChange={(newValue) => {
            if (newValue && newValue.isValid()) {
              const newAge = calculateAge(newValue);
              setFormData({
                ...formData,
                birthdate: newValue, // Save as a dayjs object
                age: newAge, // Calculate and update age
              });
              updateAgeInDatabase(newAge); // Update age in database
            }
          }}
          renderInput={(params) => (
            <TextField {...params} fullWidth sx={{ marginBottom: 2 }} />
          )}
        />
        <TextField
          id="outlined-age"
          label="Age"
          type="text"
          placeholder="Age..."
          value={formData.age}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </div>
    </LocalizationProvider>
  );
}

export default PersonalInfo;
