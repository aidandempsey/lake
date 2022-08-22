// styles
import './PostList.css'
import StatusPost from '../../components/StatusPost'

export default function PostList({ posts }) {

    return (
        <div className="post-list">
            {posts.length === 0 && <p className='no-posts'>No posts yet!</p>}
            <ul>
                {posts.map(post => (
                    <StatusPost post={post}  key={post.id}/>
                ))}
            </ul>
        </div>
    )
}