import "./User.css"
import PostList from "./../Home/PostList";
import { useCollection } from "../../hooks/useCollection"
import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import UserDetails from "./UserDetails";

export default function User() {
  const { id } = useParams();
  const {document} = useDocument("users", id);
  const { documents, error } = useCollection(
    "posts",
    ["createdBy.id", "==", id],
    ["createdAt", "desc"]);

  return (
    <div>
      {document && <UserDetails userPage={document}/>}
      {error && <p className="error">{error}</p>}
      {documents && <PostList posts={documents} />}
    </div>
  )
}
