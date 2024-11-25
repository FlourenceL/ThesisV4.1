import { Typography, TextField, Grid, Box } from "@mui/material";
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
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {/* Weight Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Body Weight:
          </Typography>
          <TextField
            fullWidth
            id="outlined-read-only-input-weight"
            label="Weight (kg)"
            value={weight}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>

        {/* Height Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Height:
          </Typography>
          <TextField
            fullWidth
            id="outlined-read-only-input-height"
            label="Height (cm)"
            value={height}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>

        {/* Body Fat Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Body Fat:
          </Typography>
          <TextField
            fullWidth
            id="outlined-read-only-input-fat"
            label="Body Fat (%)"
            value={fat}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>

        {/* BMI Category Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            BMI Category:
          </Typography>
          <TextField
            fullWidth
            id="outlined-read-only-input-bmi-category"
            label="Category"
            value={bmiCategory}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Overall;
