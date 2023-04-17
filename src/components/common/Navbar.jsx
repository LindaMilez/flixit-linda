import { Link } from "react-router-dom";
import { BsCameraVideoFill, BsClockHistory, BsHeartFill } from "react-icons/bs";
import useLogin from "../hooks/useLogin";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const loginUser = useLogin();
  return (
    loginUser && (
      <nav
        id="sidebarMenu"
        className="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse"
      >
        <div className="position-sticky pt-3 sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/movies" className="nav-link d-flex align-items-center">
                <span className="d-flex align-items-center">
                  <BsCameraVideoFill />
                </span>
                <span className="mx-2">Movies</span>
              </Link>
            </li>
            {loginUser && (
              <>
                <li className="nav-item">
                  <Link
                    to="/watchlist"
                    className="nav-link d-flex align-items-center"
                  >
                    <span className="d-flex align-items-center">
                      <BsClockHistory />
                    </span>
                    <span className="mx-2">Watch list</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/favourites"
                    className="nav-link d-flex align-items-center"
                  >
                    <span className="d-flex align-items-center">
                      <BsHeartFill />
                    </span>
                    <span className="mx-2">Favourites</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>Personal info</span>
          </h6>
          <ul class="nav flex-column mb-2">
            <li class="nav-item">
              <Link
                to="/profile"
                className="nav-link d-flex align-items-center"
              >
                <span className="d-flex align-items-center">
                  <FaUserCircle />
                </span>
                <span className="mx-2">My Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  );
};

export default Navbar;
