// reactstrap components
import { useMemo, useState } from "react";
import { FormFeedback } from "reactstrap";
import { Link } from "react-router-dom";
import { useForm } from "../../../utils/useForm";
import { registerUser } from "./authActions";

const Profile = () => {
  const [newUser, updateNewUser, onFocusOut] = useForm();
  
  const {
    username = {},
    email = {},
    password = {},
    address = {},
    city = {},
    country = {},
    postalCode = {},
    picture = {},
  } = newUser;

  const [loading, toggleLoading] = useState(false);
  const [formFeedback, setFeedback] = useState({});

  const { fieldFeedback, isFormValid } = useMemo(() => {
    const { username = {}, email = {}, password = {} } = newUser;
    const messages = {};
    let isFormValid = true;
    if (!username.value) {
      messages.username = username.touched ? "Username is required" : "";
      isFormValid = false;
    }
    if (!email.value) {
      messages.email = email.touched ? "Email is required" : "";
      isFormValid = false;
    }
    if (!password.value) {
      messages.password = password.touched ? "Password is required" : "";
      isFormValid = false;
    }
    return { fieldFeedback: messages, isFormValid };
  }, [newUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toggleLoading(true);
    setFeedback({});
    const {
      username: { value: username },
      password: { value: password },
      email: { value: email },
    } = newUser;
    try {
      await registerUser({ username, password, email });
      setFeedback({
        type: "success",
        message: (
          <span>
            User registration successful. Please proceed to{" "}
            <Link to={"/login"}>Login</Link>
          </span>
        ),
      });
    } catch (error) {
      setFeedback({ type: "danger", message: error.message });
    }
    toggleLoading(false);
  };

  return (
    <>
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">Update user info</h1>

          <div className="form-floating">
            <input
              placeholder="Name"
              type="text"
              name="username"
              value={username.value}
              onChange={updateNewUser}
              onBlur={onFocusOut}
              formNoValidate
              invalid={!!fieldFeedback.username}
              className="form-control"
            />
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating">
            <input
              type="email"
              autoComplete="new-email"
              name="email"
              value={email.value}
              onChange={updateNewUser}
              onBlur={onFocusOut}
              invalid={!!fieldFeedback.email}
              className="form-control"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              name="password"
              value={password.value}
              onChange={updateNewUser}
              onBlur={onFocusOut}
              invalid={!!fieldFeedback.password}
              className="form-control"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-floating">
            <input
              placeholder="Address"
              type="text"
              name="address"
              value={address.value}
              onChange={updateNewUser}
              onBlur={onFocusOut}
              formNoValidate
              invalid={!!fieldFeedback.address}
              className="form-control"
            />
            <label htmlFor="floatingInput">Address</label>
          </div>
          <div className="form-floating">
            <input
              type="email"
              autoComplete="new-email"
              name="email"
              value={email.value}
              onChange={updateNewUser}
              onBlur={onFocusOut}
              invalid={!!fieldFeedback.email}
              className="form-control"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              name="password"
              value={password.value}
              onChange={updateNewUser}
              onBlur={onFocusOut}
              invalid={!!fieldFeedback.password}
              className="form-control"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          {formFeedback.type && (
            <FormFeedback className={`mt-3 d-block text-${formFeedback.type}`}>
              {formFeedback.message}
            </FormFeedback>
          )}
          <button
            disabled={!isFormValid || loading}
            className="w-100 btn btn-lg btn-primary"
            type="submit"
          >
            Update
          </button>
        </form>
      </main>
    </>
  );
};

export default Profile;
