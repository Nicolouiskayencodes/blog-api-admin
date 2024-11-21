import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Login({setUser}) {
  const username = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const responseObj = await fetch("https://blog-api-backend-0ye2.onrender.com/login", {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      }),
      headers: { "Content-Type": "application/json" },
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()})
      console.log(responseObj)
      localStorage.setItem("Authorization", `Bearer ${responseObj.token}`)
      setUser(responseObj.user)
      navigate('/home');
  }
  return(<div>
    <form onSubmit={handleSubmit}>
      <label>Username: <br/>
        <input ref={username} name="username" type="text"></input>
      </label>
      <br/>
      <label>Password: <br/>
        <input ref={password} name="password" type="password"></input>
      </label>
      <br/>
      <button type="submit">Submit</button>
    </form>
  </div>)
}

Login.propTypes = {
  setUser: PropTypes.func
}