import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

function Form2({ setSelectedUserId }) {
  // Change prop to setSelectedUserId
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserIdState] = useState("");

  // Fetch users from Firebase
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "Users");

    // Listen for changes in the Users node
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        // Convert the users object to an array of {id, firstName}
        const userArray = Object.entries(usersData).map(([id, user]) => ({
          id,
          firstName: user.firstName,
        }));
        setUsers(userArray);
      }
    });
  }, []);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedUserIdState(selectedId);
    setSelectedUserId(selectedId); // Update the parent component with the selected user ID
  };

  return (
    <>
      <h1>Please choose your name: </h1>

      <select value={selectedUserId} onChange={handleChange}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.firstName}
          </option>
        ))}
      </select>
    </>
  );
}

export default Form2;
