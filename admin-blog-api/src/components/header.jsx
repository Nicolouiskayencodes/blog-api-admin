import { Link } from "react-router-dom"
import PropTypes from "prop-types";

export default function Header({setUser, user}) {
  function logout() {
    setUser(null);
    localStorage.removeItem("Authorization")
  }

  return(<header>
    <h1>Nico&#39;s Blog</h1>
    <nav>
      <Link to={'/'}>Home</Link>
      { (!user) ? (
        <>
          <Link to={'/register'}>Register</Link>
          <Link to={'/login'}>Login</Link>
        </>
        
      ) : (
        <>
        {(!user.admin)? (
           <>
          <Link to={'/admin'}>Become an administrator</Link>
          <button onClick={logout}>Logout</button>
          </>
        ):(
          <>
          <Link to={'/post'}>Post</Link>
          <button onClick={logout}>Logout</button>
          </>
        )}
        </>
        
      )}
      
    </nav>
  </header>
  )
}

Header.propTypes = {
  setUser: PropTypes.func,
  user: PropTypes.object
}