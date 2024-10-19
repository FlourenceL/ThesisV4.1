import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Layout from "./components/Layout";
import Form from "./components/Form";
import AllStars from "./components/Allstars";
import Choose from "./components/Choose";
import Form2 from "./components/Form2";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" index element={<Homepage />} />
          <Route path="/allstars" element={<AllStars />} />
          <Route path="/form" element={<Form />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/form2" element={<Form2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
