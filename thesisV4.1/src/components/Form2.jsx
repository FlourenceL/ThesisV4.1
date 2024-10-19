import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

function Form2() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();
  // Fetch users from Firebase
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "Users");

    // Listen for changes in the Users node
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        // Convert the users object to an array of first names
        const userArray = Object.values(usersData).map(
          (user) => user.firstName
        );
        setUsers(userArray);
      }
    });
  }, []);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const back = () => {
    navigate("/choose");
  };

  return (
    <>
      <h1>Please choose your name: </h1>

      <select value={selectedUser} onChange={handleChange}>
        <option value="">Select a user</option>
        {users.map((firstName, index) => (
          <option key={index} value={firstName}>
            {firstName}
          </option>
        ))}
      </select>

      <button onClick={back}>Back</button>
    </>
  );
}

export default Form2;
