import "./Post.css"
import { useParams } from "react-router-dom"
import { useDocument } from "../../hooks/useDocument";
import PostComments from "./PostComments";
import StatusPost from "../../components/StatusPost";


export default function Post() {
  const { id } = useParams();

  const { error, document } = useDocument("posts", id);

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!document) {
    return <div>Loading...</div>
  }

  return (
    <div className="post-list">
      <ul>
        <div className="post-details">
          <div className='post'>
            <ul>
              <StatusPost post={document} />
            </ul>
          </div>
          <PostComments post={document} />
        </div>
      </ul>
    </div>



  )
}
