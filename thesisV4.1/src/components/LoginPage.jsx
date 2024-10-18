import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Ensure this path is correct
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      toast.success("Logged in successfully!");
      console.log("User logged in:", user);
      navigate("/home"); // Navigate to the desired route after login
    } catch (error) {
      console.error("Error logging in:", error.message);
      toast.error("Invalid email or password!");
    }
  };

  const handleAllstars = () => {
    navigate("/allstars"); // Navigate to the desired route for Allstars
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <h1>Log in</h1>
        <label>Email</label> <br />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label> <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /> <br />
        <button type="submit">Log in</button>
      </form>

      <button onClick={handleAllstars}>Allstars!</button>
      <ToastContainer />
    </>
  );
}

export default LoginPage;
