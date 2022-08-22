import { useCollection } from "../../hooks/useCollection"

//styles & images
import "./Home.css"

//components
import Create from "../../components/Create"
import PostList from "./PostList";

export default function Home({ showModal, setShowModal }) {

  const { documents, error } = useCollection("posts",
    null,
    ["createdAt", "desc"]);

  return (
    <div className="home">
      <h2>Dashboard🏞️</h2>
      {error && <p className="error">{error}</p>}
      {documents && <PostList posts={documents} />}
      {showModal && <Create setShowModal={setShowModal} />}
    </div>
  )
}