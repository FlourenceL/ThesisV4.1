import { Typography, TextField } from "@mui/material";
import { getDatabase } from "firebase/database";

function Overall({ weight, height, fat }) {
  const db = getDatabase();

  // BMI calculation
  const heightm = height / 100.0;
  const bmi = weight / (heightm * heightm);

  // Determine BMI category
  const determineBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
      return "Overweight";
    } else {
      return "Obesity";
    }
  };

  const bmiCategory = determineBMICategory(bmi); // Get the category

  return (
    <>
      <Typography variant="h1">Body Weight:</Typography>
      <TextField
        id="outlined-read-only-input-weight"
        label="Weight"
        value={weight}
        InputProps={{
          readOnly: true,
        }}
      />
      <Typography variant="h1">Height:</Typography>
      <TextField
        id="outlined-read-only-input-height"
        label="Height"
        value={height}
        InputProps={{
          readOnly: true,
        }}
      />
      <Typography variant="h1">Body Fat:</Typography>
      <TextField
        id="outlined-read-only-input-fat"
        label="Body Fat"
        value={fat}
        InputProps={{
          readOnly: true,
        }}
      />

      {/* <Typography variant="h1">Body Mass Index (BMI):</Typography>
      <TextField
        id="outlined-read-only-input-bmi"
        label="BMI"
        value={bmi.toFixed(2)} // Display BMI value
        InputProps={{
          readOnly: true,
        }}
      /> */}
      <Typography variant="h1">BMI Category:</Typography>
      <TextField
        id="outlined-read-only-input-bmi-category"
        label="Category"
        value={bmiCategory} // Display BMI category
        InputProps={{
          readOnly: true,
        }}
      />
    </>
  );
}

export default Overall;
