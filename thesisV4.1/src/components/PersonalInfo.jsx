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
              onClick={() => onKeyPress(" ")} // Add space button functionality
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

function PersonalInfo({ formData, setFormData }) {
  const [isLetterKeyboardVisible, setIsLetterKeyboardVisible] = useState(false);
  const [isNumberKeyboardVisible, setIsNumberKeyboardVisible] = useState(false);
  const [activeField, setActiveField] = useState("");

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
      [activeField]: prevData[activeField].toString().slice(0, -1), // Ensure age is treated as a string
    }));
  };

  const handleCloseKeyboard = () => {
    setIsLetterKeyboardVisible(false);
    setIsNumberKeyboardVisible(false);
    setActiveField("");
  };

  return (
    <>
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
      />
      <br />
      <br />
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
      />
      <br />
      <br />

      <InputLabel id="gender-select-label">Gender</InputLabel>
      <Select
        labelId="gender-select-label"
        id="gender-select"
        value={formData.gender}
        label="Gender"
        onChange={(event) =>
          setFormData({ ...formData, gender: event.target.value })
        }
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </Select>

      <br />
      <br />
      <TextField
        id="outlined-age"
        label="Age"
        type="text" // Change type to text to allow keyboard input
        placeholder="Age..."
        value={formData.age}
        onFocus={() => handleFocus("age")}
        onChange={
          (event) => setFormData({ ...formData, age: event.target.value }) // Store age as a string
        }
        fullWidth
      />
      <br />
      <br />
      {isLetterKeyboardVisible && (
        <LetterKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClose={handleCloseKeyboard}
        />
      )}
      {isNumberKeyboardVisible && (
        <NumberKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClose={handleCloseKeyboard}
        />
      )}
    </>
  );
}

export default PersonalInfo;
