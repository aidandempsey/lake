//styles
import "./Navbar.css"

//images
import Logo from "../assets/logo.svg"

import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from "react"
import { useHistory } from "react-router-dom"

export default function Navbar({setShowModal}) {

  const history = useHistory();
  const { logout, isLogoutPending } = useLogout()
  const { user } = useAuthContext();
  
  const [term, setTerm] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setTerm("");
    history.push(`/search/${term}`);
    window.location.reload(true);
  }

  return (
    <nav className="navbar">
      <ul>

        <li className="logo">
          <Link to="/">
            <span>Lake</span>
            <img src={Logo} alt="logo" />
          </Link>
        </li>

        <li>
          <div className="searchbar">
            <form onSubmit={(e) => { handleSubmit(e) }}
              className="search">
              <input
                type="text"
                id="search"
                placeholder="Search"
                value={term}
                onChange={e => { setTerm(e.target.value) }} />
            </form>
          </div>
        </li>

        {!user &&
          <Link exact to="/signup">
            <li>
              <button className="btn">Signup</button>
            </li>
          </Link>}

          {user &&
          <div className="dropdown">
          <p className="dropbtn">{user.displayName}</p>
          <div className="dropdown-content">
            <Link to={`/user/${user.uid}`}>Your Page</Link>
            <Link onClick={()=>{
              setShowModal(true)
              history.push("/")}
              }>Upload</Link>
            <Link to={`/settings/${user.uid}`}>Settings</Link>
            <Link onClick={()=>{logout()}}>Logout</Link>

          </div>
        </div>
          }
      </ul>
    </nav>
  )
}