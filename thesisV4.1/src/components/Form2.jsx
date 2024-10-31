import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Form2({ setSelectedUserId }) {
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

      <FormControl fullWidth>
        <InputLabel id="select-user-label">Select a user</InputLabel>
        <Select
          labelId="select-user-label"
          id="select-user"
          value={selectedUserId}
          label="Select a user"
          onChange={handleChange}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default Form2;
