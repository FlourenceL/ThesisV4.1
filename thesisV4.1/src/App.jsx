import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Layout from "./components/Layout";
import Form from "./components/Form";
import AllStars from "./components/Allstars";
import Choose from "./components/Choose";
import Form2 from "./components/Form2";
import Form2_0 from "./components/Form2_0";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import AuthComponent from "./components/AuthComponent";

function App() {
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-input": {
              color: "#ffffff", // Sets the input text color to white
            },
            "& .MuiInputLabel-root": {
              color: "#ffffff", // Sets the label color to white
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff", // Sets the outline color to white
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff", // Keeps the outline white on hover
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#ffffff", // Keeps the outline white when focused
              },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: "#ffffff", // Sets the selected item text color to white
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff", // Sets the outline color to white
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff", // Keeps the outline white on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff", // Keeps the outline white when focused
            },
          },
          icon: {
            color: "#ffffff", // Sets the dropdown arrow color to white
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: "#333333", // Sets the background color of the dropdown menu
          },
          list: {
            color: "#ffffff", // Sets the text color of dropdown items
          },
        },
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" index element={<Homepage />} />
              <Route path="/allstars" element={<AllStars />} />
              <Route path="/form" element={<Form />} />
              <Route path="/choose" element={<Choose />} />
              <Route path="/form2" element={<Form2 />} />
              <Route path="/form2_0" element={<Form2_0 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
