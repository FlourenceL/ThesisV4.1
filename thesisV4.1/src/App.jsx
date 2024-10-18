import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import Form from "./components/Form";
import AllStars from "./components/Allstars";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./components/firebaseConfig";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking authentication status
  }

  return user ? children : <Navigate to="/" replace />;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" index element={<LoginPage />} />
          <Route path="/allstars" index element={<AllStars />} />
          {/* Protecting the routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
