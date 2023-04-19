import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateComponent = ({ auth, children }) => {
  const navigate = useNavigate();
  const { username, email } = auth || {};
  if (!username || !email) {
    return navigate("/login");
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
};

const mapStateToProps = (state) => ({
  auth: state.user,
});

export default connect(mapStateToProps)(PrivateComponent);
