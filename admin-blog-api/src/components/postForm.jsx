import { useRef } from "react"
import { useNavigate } from "react-router-dom";

export default function Post() {
  const title = useRef(null);
  const content = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    fetch("https://blog-api-backend-0ye2.onrender.com/post", {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        title: title.current.value,
        content: content.current.value,
      }),
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      navigate('/');
  }
  return(<div>
    <form onSubmit={handleSubmit}>
      <label>Post Title: <br/>
        <input ref={title} name="username" type="text"></input>
      </label>
      <br/>
      <label>Content: <br/>
        <textarea ref={content} name="password" type="password"></textarea>
      </label>
      <br/>
      <button type="submit">Submit</button>
    </form>
  </div>)
}