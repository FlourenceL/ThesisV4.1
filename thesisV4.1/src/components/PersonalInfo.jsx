//--------------------------TASKS LEFT:--------------------------------
// 1. NO PREVIOUS BUTTONS, ONLY NEXT AND TRY AGAIN. /
// 2. AFTER PRESSING NEXT, SEND ALERT (CONTINUE???). /
// 3. ADD FUNCTIONALITIES. /
// 4. FIX THE BODY SCAN PAGE (MOUND AND UNMOUNT) !!!!!!!!!!!
// 5. NO TRY AGAIN IN THE PERSONAL INFORMATION /
// 6. SUBMIT BUTTON AFTER THE BODY SCAN /
// 7. AUTHENTICATION TOKEN AND INTERFACE FOR USERS !!!!!!!!!!!! DO THIS FIRST
// 8. USER HISTORY (THESIS OBJECTIVE: LET USERS TRACK PROGRESS) !!!!!!!!!!!!!!
// 9. CREATE CUSTOM KEYBOARD -_- !!!!!!!!!!!!!!!! DO THIS LAST
// 10. FINAL DESIGN OF THE SYSTEM !!!!!!!!!!!!!!!!
// 11. DEPLOY SITE ONLINE !!!!!!!!!!!!!!!!!
import { TextField } from "@mui/material";
function PersonalInfo({ formData, setFormData }) {
  return (
    <>
      <TextField
        id="outlined-basic"
        label="First Name"
        variant="outlined"
        type="text"
        placeholder="First name..."
        value={formData.firstName}
        onChange={(event) =>
          setFormData({ ...formData, firstName: event.target.value })
        }
      />{" "}
      <br />
      <br />
      <TextField
        id="outlined-basic"
        label="Last Name"
        variant="outlined"
        type="text"
        placeholder="Last name..."
        value={formData.lastName}
        onChange={(event) =>
          setFormData({ ...formData, lastName: event.target.value })
        }
      />{" "}
      <br /> <br />
      <TextField
        id="outlined-basic"
        label="Age"
        type="number"
        placeholder="Age..."
        value={formData.age}
        onChange={(event) =>
          setFormData({ ...formData, age: event.target.value })
        }
      />{" "}
      <br /> <br />
    </>
  );
}
export default PersonalInfo;
