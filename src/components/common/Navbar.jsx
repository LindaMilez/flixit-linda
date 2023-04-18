import { Link } from "react-router-dom";
import { BsHeartFill, BsStarFill } from "react-icons/bs";
import useLogin from "../hooks/useLogin";
import { FaBullhorn, FaClock, FaDollarSign, FaPhoneVolume, FaUserCircle } from "react-icons/fa";

const Navbar = ({ filter = "popular" }) => {
  const loginUser = useLogin();
  
  const getActiveStyles = (path) => {
    if (path === filter) {
      return {
        backgroundColor: "#7e9ad03d"
      }
    }
    return {};
  };

  return (
    loginUser && (
      <nav
        id="sidebarMenu"
        className="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse"
      >
        <div className="position-sticky pt-3 sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item rounded mx-2" style={getActiveStyles("popular")}>
              <Link to="/popular" className="nav-link d-flex align-items-center">
                <span className="d-flex align-items-center">
                  <BsStarFill color="gold" />
                </span>
                <span className="mx-2">Popular</span>
              </Link>
            </li>
            <li className="nav-item rounded mx-2" style={getActiveStyles("upcoming")}>
              <Link to="/upcoming" className="nav-link d-flex align-items-center">
                <span className="d-flex align-items-center">
                  <FaBullhorn color="red"/>
                </span>
                <span className="mx-2">Upcoming</span>
              </Link>
            </li>
            {loginUser && (
              <>
                <li className="nav-item rounded mx-2" style={getActiveStyles("watchlist")}>
                  <Link
                    to="/watchlist"
                    className="nav-link d-flex align-items-center"
                  >
                    <span className="d-flex align-items-center">
                      <FaClock color="blue" />
                    </span>
                    <span className="mx-2">Watch list</span>
                  </Link>
                </li>
                <li className="nav-item rounded mx-2" style={getActiveStyles("favourites")}>
                  <Link
                    to="/favourites"
                    className="nav-link d-flex align-items-center"
                  >
                    <span className="d-flex align-items-center">
                      <BsHeartFill color="red" />
                    </span>
                    <span className="mx-2">Favourites</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>Personal info</span>
          </h6>
          <ul className="nav flex-column mb-2">
            <li className="nav-item">
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
            <li className="nav-item">
              <Link
                to="/pricing"
                className="nav-link d-flex align-items-center"
              >
                <span className="d-flex align-items-center">
                  <FaDollarSign />
                </span>
                <span className="mx-2">Pricing</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contactus"
                className="nav-link d-flex align-items-center"
              >
                <span className="d-flex align-items-center">
                  <FaPhoneVolume />
                </span>
                <span className="mx-2">Contact Us</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  );
};

export default Navbar;
