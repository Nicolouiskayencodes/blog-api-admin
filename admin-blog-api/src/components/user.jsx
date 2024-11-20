import PropTypes from "prop-types";
export default function User({user}) {
  if (user) {
    console.log(user)
  return(<div>Welcome {user.username}</div>)
  } else {
    return <div>Welcome, you are not signed in</div>
  }
}

User.propTypes = {
  user: PropTypes.object
}