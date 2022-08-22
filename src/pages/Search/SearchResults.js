import { Link } from "react-router-dom";
import StatusPost from "../../components/StatusPost";

export default function SearchResults({ results }) {
    return (
        <div className="search-results">
            <ul>
                {results.map(result => (
                    
                    <Link to={`../user/${result.id}`}>
                        <StatusPost post={result} />
                    </Link>
                ))}
            </ul>
            {!results.length && <p className="error">No matching usernames</p>}
        </div>
    )
}
