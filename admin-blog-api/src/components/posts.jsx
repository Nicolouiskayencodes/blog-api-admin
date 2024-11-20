import PropTypes from "prop-types";
export default function Posts({posts}) {
  return(
    <div>
      {(posts && posts.length > 0)?
      (posts.map(post=>
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Comments</p>
          {post.comments.map(comment=>
            <>
              <p>{comment.content}</p>
              <p>{comment.createdAt}</p>
            </>
          )}
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
  posts: PropTypes.array
}