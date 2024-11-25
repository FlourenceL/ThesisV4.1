import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Stack } from "@mui/material";

function Choose() {
  const navigate = useNavigate();

  const form = () => {
    navigate("/form");
  };

  const home = () => {
    navigate("/");
  };

  const form2 = () => {
    navigate("/form2_0");
  };

  // Glassmorphism styles
  const glassStyle1 = {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "20px",
    width: "300px",
    textAlign: "center",
  };

  const glassStyle2 = {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "16px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    padding: "20px",
    width: "300px",
    textAlign: "center",
  };

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      {/* Main Title */}
      <Typography variant="h4" gutterBottom>
        Have you used this machine before?
      </Typography>

      <Box display="flex" justifyContent="center" gap={6} mt={4}>
        {/* First Time Section with Glassmorphism */}
        <Box sx={glassStyle1}>
          <Stack alignItems="center" spacing={2}>
            <dotlottie-player
              className="register"
              src="https://lottie.host/0728bf56-8317-4d52-b0fd-df9fcdfcbffb/Of7UgrApAq.json"
              background="transparent"
              speed="0.75"
              style={{ width: "100%", maxWidth: "120px", height: "auto" }}
              loop
              autoplay
            />

            <Typography variant="h6">
              No, this is my first time using it
            </Typography>
            <Button variant="contained" onClick={form}>
              Continue
            </Button>
          </Stack>
        </Box>

        {/* Used Before Section with Different Glassmorphism */}
        <Box sx={glassStyle2}>
          <Stack alignItems="center" spacing={2}>
            <dotlottie-player
              className="register2"
              src="https://lottie.host/f09362a1-a733-4d2d-bf97-4e3cecfb0676/HLuEoxGiKD.json"
              background="transparent"
              speed="0.75"
              style={{ width: "100%", maxWidth: "130px", height: "auto" }}
              loop
              autoplay
            />
            <Typography variant="h6">Yes, I've used this before</Typography>
            <Button variant="contained" onClick={form2}>
              Continue
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Center Back Button */}
      <Box mt={4}>
        <Button variant="contained" onClick={home}>
          Back
        </Button>
      </Box>
    </Box>
  );
}

export default Choose;
