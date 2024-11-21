import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
export default function Posts({posts, reload, user}) {
  const commentContent = useRef([]);
  const navigate = useNavigate();
  const [inputStates, setInputStates] = useState({});
  const commentRefs = useRef([]);

  const commentInput = (id) => {
    setInputStates((prevStates) => ({ ...prevStates, [id]: true }));
  };
  const updateComment = async (commentId) => {
    console.log(commentRefs.current[commentId])
    fetch(`https://blog-api-backend-0ye2.onrender.com/comment/${commentId}`, {
      mode: "cors",
      method: "PUT", body: JSON.stringify({
        content: commentRefs.current[commentId].value
      }),
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      commentRefs.current[commentId].value = ''
      setInputStates((prevStates) => ({ ...prevStates, [commentId]: false }))
      reload(true)
      navigate('/')
  }
  const leaveComment = async (postId) =>{
    console.log(commentContent.current[postId].value)
    fetch(`https://blog-api-backend-0ye2.onrender.com/comment/${postId}`, {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        content: commentContent.current[postId].value
      }),
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      commentContent.current[postId].value = ''
      reload(true)
      navigate('/')
  }
  const removeComment = async (commentId) => {
    fetch(`https://blog-api-backend-0ye2.onrender.com/comment/${commentId}`, {
      mode: "cors",
      method: "DELETE",
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      reload(true)
      navigate('/')
  }
  
  const publish = async (postId) => {
    fetch(`https://blog-api-backend-0ye2.onrender.com/publish/${postId}`, {
      mode: "cors",
      method: "PUT",
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      reload(true)
      navigate('/')
  }
  const remove = async (postId) => {
    fetch(`https://blog-api-backend-0ye2.onrender.com/post/${postId}`, {
      mode: "cors",
      method: "DELETE",
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      reload(true)
      navigate('/')
  }
  return(
    <div className="content">
      {(posts && posts.length > 0 && user)?
      (posts.map(post=>
        <div key={post.id} className="post" >
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {(post.updateAt)? (
            <p>Update at {Date(post.updateAt)}</p>
          ):(
            <p>Created at {Date(post.createdAt)}</p>
          )}
          {(!post.published) ?(
            <>
              <button onClick={()=>publish(post.id)} >Publish</button>
              <button onClick={()=>navigate(`/updatePost/${post.id}`)} >Update</button>
              <button onClick={()=>remove(post.id)} >Delete</button>
            </>
            
          ): (
            <>
              <p>Published ✔</p>
              <button onClick={()=>navigate(`/updatePost/${post.id}`)} >Update</button>
              <button onClick={()=>remove(post.id)} >Delete</button>
            </>
          )}
          <h3>Comments</h3>
          {post.comments.map(comment=>
            <div key={comment.id} className="comment">
              <p>{comment.author.username}:</p>
              <p>{comment.content}</p>
              {(comment.updateAt)? (
                <p>Update at {Date(comment.updateAt)}</p>
              ):(
                <p>Created at {Date(comment.createdAt)}</p>
              )}
             {user ? (<>
              {(comment.authorId === user.id && !inputStates[comment.id])?(
                <button onClick={()=>commentInput(comment.id)}>Update</button>
              ):(comment.authorId === user.id && inputStates[comment.id])?(
                <>
                <input ref={el => commentRefs.current[comment.id] = el} type="text" defaultValue={comment.content}></input>
                <button onClick={()=>updateComment(comment.id)}>Update Comment</button>
                </>
              ):(
                <></>
              )} 
              {(comment.authorId === user.id || user.admin)?(
                <button onClick={()=>removeComment(comment.id)}>Delete</button>
              ):(
                <></>
              )}
            </>): (<></>)}
            </div>
          )}
          <br></br>
          <label>Leave a comment: <input ref={el =>commentContent.current[post.id] = el} type="text"></input><button onClick={()=>leaveComment(post.id)}>Submit Comment</button></label>
          <hr></hr>
          </div>
          
         )
      ) : (
        <p>Sign into an admin account to view posts</p>
      )
      }
     
      </div>
  )
  }


Posts.propTypes = {
  posts: PropTypes.array,
  reload: PropTypes.func,
  user: PropTypes.object
}