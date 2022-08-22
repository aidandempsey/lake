import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useLogin } from "../../hooks/useLogin";

//styles & images
import "./Signup.css"

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("")
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signingUp, setSigningUp] = useState(true);
  const [signupError, setSignupError] = useState("");

  const { signup, error, isPending } = useSignup();
  const { login, loginError, isLoginPending } = useLogin();

  const handleLogin = e => {
    e.preventDefault();
    login(loginEmail, loginPassword);
    setLoginEmail("");
    setLoginPassword("");
  }

  const handleSignup = e => {
    e.preventDefault();
    try{
    signup(email, password, displayName, thumbnail);
    setEmail("");
    setPassword("");
    setDisplayName("");
    setThumbnail(null);
    document.getElementById("file-input").value = "";}
    catch(err){
      setSignupError(err.message);
    }
  }

  const handleFileChange = e => {
    let selected = e.target.files[0];
    console.log(selected);

    if (!selected) {
      setThumbnailError("Please select a file");
      return
    }

    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    if (!selected.size > 100000) {
      setThumbnailError("Image filesize must be less than 100kb");
      return;
    }

    setSuccess("Selected: " + extractFilename(e.target.value));
    setThumbnailError(null);
    setThumbnail(selected);
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

  return (
    <div className="forms">
      {signingUp &&(
      <form
        className="auth-form"
        onSubmit={handleSignup}>
        <h2>Sign Up</h2>
          <input
            required
            type="email"
            value={email}
            placeholder="Email"
            onChange={e => { setEmail(e.target.value) }} />
          <input
            required
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => { setPassword(e.target.value) }} />
          <input
            required
            type="text"
            value={displayName}
            placeholder="Name"
            onChange={e => { setDisplayName(e.target.value) }} />
        <label>
          <span>Profile Picture</span>
          <input
            required
            type="file"
            onChange={handleFileChange}
            id="file-input"
          />
          {thumbnailError && <div className="error">{thumbnailError}</div>}
          {success && <div className="success">{success}</div>}
        </label>
        {!isPending && <button className="btn">Sign up</button>}
        {isPending && <button className="btn" disabled>Signing up...</button>}
        {error && <p className="error">{error}</p>}
        {signupError && <p className="error">{signupError}</p>}
      </form>)}

     {!signingUp && (<form className="auth-form"
        onSubmit={handleLogin}>
        <h2>Login</h2>

          <input
            required
            type="email"
            value={loginEmail}
            placeholder="Email"
            onChange={e => { setLoginEmail(e.target.value) }} />
          <input
            required
            type="password"
            value={loginPassword}
            placeholder="Password"
            onChange={e => { setLoginPassword(e.target.value) }} />
        {!isLoginPending && <button className="btn">Login</button>}
        {isLoginPending && <button className="btn" disabled>Logging in...</button>}
        {loginError && <p className="error">{loginError}</p>}
        {signupError && <p className="error">{signupError}</p>}
      </form>)}
      {!signingUp && <div className="options"> <p>Don't have an account?</p><button onClick={()=>setSigningUp(true)} className="btn">Signup</button></div>}
      {signingUp && <div className="options"> <p>Already have an account?</p><button onClick={()=>setSigningUp(false)} className="btn">Login</button></div>}
    </div>
  )
}
