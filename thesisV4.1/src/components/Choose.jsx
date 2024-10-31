import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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
  return (
    <>
      <h1>Have you used this machine before?</h1>
      <Button variant="contained" onClick={form}>
        No, not yet
      </Button>
      <Button variant="contained" onClick={form2}>
        Yes, I've used it before
      </Button>
      <Button variant="contained" onClick={home}>
        Back
      </Button>
    </>
  );
}

export default Choose;
