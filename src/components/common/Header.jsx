import { Link, useNavigate } from "react-router-dom";
import { signOutUser } from "../pages/auth/authActions";
import { connect } from "react-redux";
import useLogin from "../hooks/useLogin";
import { useState } from "react";

const Header = ({ dispatchSignOut }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = useLogin();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <Link to="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">
        Flixit
      </Link>
      <button
        className="navbar-toggler position-absolute d-md-none collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <input
        className="form-control form-control-dark w-100 rounded-0 border-0"
        type="text"
        placeholder="Search"
        aria-label="Search"
        value={searchTerm}
        onChange={({ currentTarget }) => setSearchTerm(currentTarget.value)}
        onKeyPress={handleKeyPress}
      />
      {!user.email && (
        <ul class="navbar-nav mb-md-0 mx-3">
          <li class="nav-item">
            <Link to="/contactus" className="nav-link" style={{ width: 80 }}>
              Contact Us
            </Link>
          </li>
        </ul>
      )}
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          {user.email ? (
            <button
              className="border-0 bg-dark nav-link px-3"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                dispatchSignOut();
              }}
            >
              Sign out
            </button>
          ) : (
            <button
              className="border-0 bg-dark nav-link px-3"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSignOut: () => dispatch(signOutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
