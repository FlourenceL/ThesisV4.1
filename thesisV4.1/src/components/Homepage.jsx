import React from "react";
import { useNavigate } from "react-router-dom";
import "@dotlottie/player-component";
import { Button, Box, Grid, Typography, Paper } from "@mui/material";

function Homepage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/choose");
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left side: Animation */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <dotlottie-player
              className="Imo"
              src="https://lottie.host/ad2bca8d-7994-4b59-ba5e-768e4ddee51b/MGSYf25Ffs.json"
              background="transparent"
              speed="0.75"
              style={{ width: "100%", maxWidth: "450px", height: "auto" }} // Adjusted maxWidth
              loop
              autoplay
            />
          </Grid>

          {/* Right side: Text and button */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              sx={{
                padding: 4,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)", // Shadow for depth
                textAlign: "center",
                backdropFilter: "blur(10px)", // Glassmorphism effect
                maxWidth: 400,
                marginLeft: { xs: 0, sm: -15 }, // Shift left on small screens and above
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#FFFFFF" }}
              >
                Welcome!
              </Typography>
              <Typography variant="body1" sx={{ color: "#FFFFFF", mb: 3 }}>
                Quickly find out your body weight, height, and body fat
                percentage. Easy metrics, healthier you!
              </Typography>
              <Button
                variant="contained"
                onClick={handleNavigate}
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "#000",
                  borderRadius: "20px",
                  paddingX: 4,
                  paddingY: 1.5,
                  fontWeight: "bold",
                }}
              >
                Get Started
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Homepage;
