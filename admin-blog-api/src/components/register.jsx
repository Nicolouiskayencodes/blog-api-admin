import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Register() {
  const username = useRef(null);
  const password = useRef(null);
  const passConfirm = useRef(null);
  const [mismatch, setMismatch] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.current.value !== passConfirm.current.value) {
      setMismatch(true)
      throw new Error("Passwords do not match")
    }
    if (password.current.value === passConfirm.current.value) {
      setMismatch(false)
    }
    fetch("http://localhost:3000/register", {
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
      return response.json()});
      navigate('/login');
  }
  return(<div>
    {mismatch && <p>Your passwords did not match</p>}
    <form onSubmit={handleSubmit}>
      <label>Username: <br/>
        <input ref={username} name="username" type="text"></input>
      </label>
      <br/>
      <label>Password: <br/>
        <input ref={password} name="password" type="password"></input>
      </label>
      <br/>
      <label>Confirm Password: <br/>
        <input ref={passConfirm} name="passwordConfirm" type="password"></input>
      </label>
      <br/>
      <button type="submit">Submit</button>
    </form>
  </div>)
}