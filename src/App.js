import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home/Home";
import configureAppStore from "./store/store";
import MovieDetails from "./components/common/MovieDetail";
import Header from "./components/common/Header";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Anonymous from "./components/wrappers/AnonymousComponent";
import { preLoadState } from "./utils/preLoadState";
import { useEffect, useState } from "react";
import { Container, Spinner } from "reactstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Private from "./components/wrappers/PrivateComponent";
import Profile from "./components/pages/auth/Profile";
import Favourites from "./components/common/Favourites";

function App() {
  
  const [preLoadedState, setPreLoadedState] = useState(undefined);

  useEffect(() => {
    const getPreState = async () => {
      const loginState = await preLoadState();
      setPreLoadedState(loginState);
    };
    getPreState();
  }, []);

  if (!preLoadedState) {
    return <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner
        as="span"
        animation="border"
        role="status"
        size="sm"
      />
    </Container>
  }

  const store = configureAppStore(preLoadedState);

  return (
    <Provider store={store}>
      <div className="App">
      <ToastContainer position="top-right" closeOnClick newestOnTop pauseOnHover draggable autoClose={3000} />
      <Router>
        <Header />
          <Routes>
            <Route path="/" element={<Home filter="popular" />} />
            <Route path="/upcoming" element={<Home filter="upcoming" />} />
            <Route path="/popular" element={<Home filter="popular" />} />
            <Route path="/watchlist" element={<Favourites filter="watchlist" />} />
            <Route path="/favourites" element={<Favourites filter="favourites" />} />
            <Route path="/search/:searchTerm" element={<Home filter="search" />} />
            <Route path="/movie/:movieId" element={<MovieDetails />}  />
            <Route path="/login" element={<Anonymous><Login /></Anonymous>}  />
            <Route path="/register" element={<Anonymous><Register /></Anonymous>}  />
            <Route path="/profile" element={<Private><Profile /></Private>}  />
            {/* <Route path="/*" element={<NotFound />} />
            <Route path="/login" element={<Login />} /> */}
          </Routes>
      </Router>
      </div>
    </Provider>
  );
}

export default App;
