import { useState } from "react"
import { timestamp } from "../../firebase/config"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useFirestore } from "../../hooks/useFirestore";
import { Link } from "react-router-dom";
import { projectStorage } from "../../firebase/config";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

//components
import Avatar from '../../components/Avatar'

export default function PostComments({ post }) {
    const [isPending, setIsPending] = useState(false);
    const [newReply, setNewReply] = useState("");
    const [photoError, setPhotoError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [photo, setPhoto] = useState(null);
    const { user } = useAuthContext();
    const { updateDocument } = useFirestore("posts");
    const [i, setI] = useState(0);


    const handleFileChange = e => {
        let selected = e.target.files[0];
        console.log(selected);

        if (!selected) {
            setPhotoError("Please select a file");
            return
        }

        if (!selected.type.includes("image")) {
            setPhotoError("Selected file must be an image");
            return;
        }

        if (!selected.size > 100000) {
            setPhotoError("Image filesize must be less than 100kb");
            return;
        }

        setSuccess("Selected: " + extractFilename(e.target.value));
        setPhotoError(null);
        setPhoto(selected);
    }

    const extractFilename = (path) => {
        if (path.substr(0, 12) === "C:\\fakepath\\")
            return path.substr(12); // modern browser
        var x;
        x = path.lastIndexOf('/');
        if (x >= 0) // Unix-based path
            return path.substr(x + 1);
        x = path.lastIndexOf('\\');
        if (x >= 0) // Windows-based path
            return path.substr(x + 1);
        return path; // just the filename
    }

    const handleClick = async comment => {
        const newComments = post.comments;

        const filteredComments = newComments.filter(com => {
            return com.id !== comment.id;
        });

        await updateDocument(post.id, {
            comments: filteredComments
        });

    }

    function uuid() {
        let temp_url = URL.createObjectURL(new Blob());
        let uuid = temp_url.toString();
        URL.revokeObjectURL(temp_url);
        return uuid.substr(uuid.lastIndexOf('/') + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setIsPending(true);
        let imageURL = null;
        if (photo) {
            const uploadPath = `commentPhotots/${post.id}/${photo.name}`;
            const image = await projectStorage.ref(uploadPath).put(photo);
            imageURL = await image.ref.getDownloadURL();
        }

        const replyToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            reply: newReply,
            commentCreatedBy: user.uid,
            createdAt: timestamp.fromDate(new Date()),
            id: uuid(),
            imageURL: imageURL ? imageURL : null
        }

        await updateDocument(post.id, {
            comments: [...post.comments, replyToAdd]
        });
        setNewReply("");
        setPhoto(null);
        document.getElementById("file-input").value = "";
        setIsPending(false);
    }

    return (
        <div className="post-comments">
            <ul>
                <form onSubmit={handleSubmit}>
                    <h4>Add a comment</h4>
                    <label>
                        {user && <textarea
                            required
                            onChange={e => {
                                setNewReply(e.target.value)
                                setI(e.target.value.length)
                            }}
                            value={newReply} />}

                        {!user &&
                            <textarea
                                disabled
                                value="Log in to leave a comment" />}
                        {i <= 300 ? <p>{i}/300</p> : <p className="error">{i}/300 - Character limit exceeded</p>}

                    </label>
                    {i <= 300 && newReply !== "" && !isPending && <button className="btn submit">Add Comment</button>}
                    {((i > 300 || newReply === "") || isPending) && <button className="btn" disabled>Add Comment</button>}
                </form>


                {post.comments.length > 0 && post.comments.slice(0).reverse().map(comment => (
                    <li key={comment.id}>
                        <div className="comment">
                            <Link to={`/user/${comment.commentCreatedBy}`} >
                                <Avatar src={comment.photoURL} />
                            </Link>
                            <div className='comment-details'>
                                <h1 className='user-name'>{comment.displayName}</h1>
                                <p>posted {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                            </div>
                            <p>{comment.reply}</p>
                            {user && user.uid === comment.commentCreatedBy && <button className='btn' onClick={() => { handleClick(comment) }}>x</button>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
