import React from "react";
import { Button, Box, Grid, Popover } from "@mui/material";

const CustomKeyboard = ({ isOpen, anchorEl, handleClose, addCharacter }) => {
  const letters = "abcdefghijklmnopqrstuvwxyz.".split("");

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Grid container spacing={1}>
          {letters.map((char, index) => (
            <Grid item xs={3} key={index}>
              <Button
                variant="contained"
                onClick={() => addCharacter(char)}
                fullWidth
              >
                {char}
              </Button>
            </Grid>
          ))}
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              fullWidth
            >
              Enter
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};

export default CustomKeyboard;
