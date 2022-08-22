import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useState } from 'react';

//pages
import Home from "./pages/Home/Home"
import Settings from "./pages/Settings/Settings"
import Signup from "./pages/Signup/Signup"
import Post from "./pages/Post/Post"
import User from "./pages/User/User"
import Search from "./pages/Search/Search"

//components
import Navbar from './components/Navbar';
import Player from './components/Player';

function App() {
  const { user, authIsReady } = useAuthContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <div className='container'>
            <Navbar  showModal={showModal} setShowModal={setShowModal} />
            
            <Switch>
              <Route exact path="/">
                <Home showModal={showModal} setShowModal={setShowModal} />
              </Route>
              <Route exact path="/search/:q">
                {user && <Search />}
                {!user && <Redirect to="/signup" />}
              </Route>
              <Route exact path="/settings/:id">
                {user && <Settings />}
                {!user && <Redirect to="/signup" />}
              </Route>
              <Route exact path="/signup">
                {!user && <Signup />}
                {user && <Redirect to="/" />}
              </Route>
              <Route exact path="/post/:id">
                <Post />
              </Route>
              <Route exact path="/user/:id">
                <User />
              </Route>
              <Route exact path="/player/:id">
                <Player />
              </Route>
            </Switch>
            
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
