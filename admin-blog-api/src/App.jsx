import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'
import Header from './components/header.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'
import User from './components/user.jsx'
import Posts from './components/posts.jsx'
import Admin from './components/admin.jsx'
import Post from './components/postForm.jsx'


function App() {
  const {page} = useParams()
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  console.log(posts)
  function assignUser(userObj) {
    setUser(userObj)
  }
  useEffect(()=>{
    const token = localStorage.getItem("Authorization");
    console.log({"Authorization": token})
    fetch('http://localhost:3000/protected', {mode: 'cors', method:"GET", headers:{
      "Authorization": token,
      "Content-Type": "application/json"
    }})
    .then(response=>{ 
      if (response.status === 401) {
        setUser(null)
        throw new Error("Expired token");
      }
      return response.json()})
    .then(response=>setUser(response))
    fetch('http://localhost:3000/posts', {mode: 'cors', method: "GET"})
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()})
    .then(response=>setPosts(response))
    .catch(error=>console.log(error))
    .finally(()=> setLoading(false))
  }, [])
  return (
    <>
      <Header setUser={assignUser} user={user}/>
      {page === 'register' ? (
        <Register setUser={assignUser} user={user}/>
      ) : page === 'login' ? (
        <Login setUser={assignUser}/>
      ) : page === 'admin' ? (
        <Admin user={user}/>
      ): page === 'post' ? (
        <Post />
      ): (
        (loading && <p>Loading...</p>),
        <>
          <User user={user}/>
          <Posts posts={posts}/>
        </>
      )}
    </>
  )
}

export default App
