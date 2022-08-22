import { Link, useHistory } from 'react-router-dom'
import { useAuthContext } from "../hooks/useAuthContext"
import { projectStorage } from "../firebase/config"
import { useFirestore } from "../hooks/useFirestore"
import { useDocument } from '../hooks/useDocument'
import { useEffect, useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

//styles & images
import "./StatusPost.css"
import Comments from "../assets/comment_icon.svg"
import Like from "../assets/like_icon.svg"
import Liked from "../assets/liked_icon.svg"

//components
import Avatar from './Avatar'
import Player from './Player'

export default function StatusPost({ post }) {
  const { user } = useAuthContext();
  const { deleteDocument, updateDocument } = useFirestore("posts");
  const { document } = useDocument("posts", post.id);
  
  const [liked, setLiked] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (document && document.likes && user) {
      document.likes.forEach(like => {
        if (like.likeCreatedBy === user.uid) {
          setLiked(true);
        }
      });
    }
  }, [document]);

  function uuid() {
    let temp_url = URL.createObjectURL(new Blob());
    let uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    return uuid.substr(uuid.lastIndexOf('/') + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
  }

  const addLike = async () => {
    if (!user) {
      history.push("/signup");
    }

    if (document) {
      if (!liked) {
        const likeToAdd = {
          likeCreatedBy: user.uid,
          id: uuid(),
        }

        await updateDocument(post.id, {
          likes: [...post.likes, likeToAdd]
        });

      }
    }
  }

  const deleteLike = async () => {
    let likeID = "";

    post.likes.forEach(like => {
      if (like.likeCreatedBy === user.uid) {
        likeID = like.id;
      }
    });

    const newLikes = post.likes;

    const filteredLikes = newLikes.filter(like => {
      return like.id !== likeID;
    });

    await updateDocument(post.id, {
      likes: filteredLikes
    });

    setLiked(false);
  }

  const handleClick = async e => {
    e.preventDefault();
    if (post.photoURL) {
      await projectStorage.refFromURL(post.photoURL).delete();
    }
    if (post.audioURL) {
      await projectStorage.refFromURL(post.audioURL).delete();
    }
    deleteDocument(post.id);


    history.push("/");
  }

  return (
    <li>
      <div className="status-post">
        <Link to={`/user/${post.createdBy.id}`}>
          <Avatar src={post.createdBy.photoURL} />
        </Link>
        <div className='details'>
          <h1 className='user-name'>{post.createdBy.display}</h1>
          <p>posted {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}</p>
        </div>
        {user && user.uid === post.createdBy.id && <button className='btn' onClick={handleClick}>x</button>}
        <Player document={post}/>

        <div className='surround-comments'>
          <div className='like-details'>
            {!liked && <img className='like-icon' src={Like} alt="like" onClick={() => addLike()} />}
            {liked && <img className='liked-icon' src={Liked} alt="like" onClick={() => deleteLike()} />}
            {post.likes && <p className='likes'>{post.likes.length} {post.likes.length !== 1 ? "likes" : "like"}</p>}
            {!post.likes && <p className='likes'>0 likes</p>}

          </div>
          <Link to={`/post/${post.id}`}>
            <div className='comments-details'>
              <br /><img className='comments-icon' src={Comments} alt="comments" /><p className='comments'>{post.comments.length} {post.comments.length !== 1 ? "comments" : "comment"}</p>
            </div>
          </Link>
        </div>
      </div>
    </li>
  )
}