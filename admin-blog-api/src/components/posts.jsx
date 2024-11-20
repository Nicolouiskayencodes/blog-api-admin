import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
export default function Posts({posts, reload, user}) {
  const comment = useRef(null);
  const navigate = useNavigate();
  const [inputStates, setInputStates] = useState({});
  const commentRefs = useRef([]);

  const commentInput = (id) => {
    setInputStates((prevStates) => ({ ...prevStates, [id]: true }));
  };
  const updateComment = async (commentId) => {
    console.log(commentRefs.current[commentId])
    fetch(`http://localhost:3000/comment/${commentId}`, {
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
      comment.current.value = ''
      setInputStates((prevStates) => ({ ...prevStates, [commentId]: false }))
      reload(true)
      navigate('/')
  }
  const leaveComment = async (postId) =>{
    fetch(`http://localhost:3000/comment/${postId}`, {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        content: comment.current.value
      }),
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      comment.current.value = ''
      reload(true)
      navigate('/')
  }
  const removeComment = async (commentId) => {
    fetch(`http://localhost:3000/comment/${commentId}`, {
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
    fetch(`http://localhost:3000/publish/${postId}`, {
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
    fetch(`http://localhost:3000/post/${postId}`, {
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
    <div>
      {(posts && posts.length > 0)?
      (posts.map(post=>
        <div key={post.id}>
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
              <button onClick={()=>remove(post.id)} >Delete</button>
            </>
            
          ): (
            <>
              <p>Published ✔</p>
              <button onClick={()=>remove(post.id)} >Delete</button>
            </>
          )}
          <p>Comments</p>
          {post.comments.map(comment=>
            <>
              <p>{comment.content}</p>
              {(comment.updateAt)? (
                <p>Update at {Date(comment.updateAt)}</p>
              ):(
                <p>Created at {Date(comment.createdAt)}</p>
              )}
              {(comment.authorId === user.id || user.admin)?(
                <button onClick={()=>removeComment(comment.id)}>Delete</button>
              ):(
                <></>
              )}
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
            </>
          )}
          <label>Leave a comment: <input ref={comment} type="text"></input><button onClick={()=>leaveComment(post.id)}>Submit Comment</button></label>
          </div>
         )
      ) : (
        <p>No posts yet</p>
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