import "./Search.css"
import SearchResults from "./SearchResults";
import { useCollection } from "../../hooks/useCollection"
import { useParams } from "react-router-dom";

export default function Search() {
  const {q} = useParams();
  const { documents, error } = useCollection("posts", ["title","==",q]);

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!documents) {
    return <div>Loading...</div>
  }

  return (
      <div className="results">
       {documents && <SearchResults results={documents} />}
      </div>
  )
}
