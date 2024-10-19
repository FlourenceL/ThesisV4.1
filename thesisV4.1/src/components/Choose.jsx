import { useNavigate } from "react-router-dom";

function Choose() {
  const navigate = useNavigate();
  const form = () => {
    navigate("/form");
  };

  const home = () => {
    navigate("/");
  };

  const form2 = () => {
    navigate("/form2");
  };
  return (
    <>
      <h1>Have you used this machine before?</h1>
      <button onClick={form}>No, not yet</button>
      <button onClick={form2}>Yes, I've used it before</button>
      <button onClick={home}>Back</button>
    </>
  );
}

export default Choose;
