
import Avatar from "../../components/Avatar"

export default function UserDetails({ userPage }) {

    return (
        <div className="user">
            <div className="comment-author">
                <Avatar src={userPage.photoURL} />
            </div>
            <div className="text">
                <h4>{userPage.displayName}</h4>
                <div className="time">
                    {userPage.country && <p>{userPage.country.label}📍</p>}
                </div>
                {userPage.bio && <p className="bio">{userPage.bio}</p>}
            </div>
            
        </div>
    )
}
