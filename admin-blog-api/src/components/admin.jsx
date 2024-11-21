import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Admin({setUser, user}) {
  const adminPassword = useRef(null);
  const [incorrect, setIncorrect] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
     await fetch("http://localhost:3000/admin", {
      mode: "cors",
      method: "PUT", body: JSON.stringify({
        adminPassword: adminPassword.current.value,
      }),
      headers: { "Content-Type": "application/json",
        "Authorization": localStorage.getItem("Authorization"),
       },
    })
    .then(response=>{ 
      if (response.status >= 400) {
        setIncorrect(true)
        throw new Error("server error");
      }
      return response.json()})
      user.admin = true
      setUser(user);
      navigate('/home');
  }
  return(<div>
    {incorrect && <p>The password was incorrect</p>}
    <form onSubmit={handleSubmit}>
      <label>Admin Password: <br/>
        <input ref={adminPassword} name="password" type="password"></input>
      </label>
      <br/>
      <button type="submit">Submit</button>
    </form>
  </div>)
}

Admin.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
}