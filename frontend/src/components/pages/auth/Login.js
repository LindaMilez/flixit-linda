// reactstrap components
import { useMemo } from "react";
import { connect, useSelector } from "react-redux";
import {
  FormFeedback,
} from "reactstrap";
import { signInUser } from "./authActions";
import { useForm } from "../../../utils/useForm";
import './signin.css';

const Login = ({ dispatchSignInUser }) => {
  const { authUser } = useSelector((state) => ({
    authUser: state.user,
  }));
  const [loginUser, updateLoginUser] = useForm();
  const { loading, error } = authUser;
  const { email = {}, password = {} } = loginUser;

  const { fieldFeedback, isFormValid } = useMemo(() => {
    const { email = {}, password = {} } = loginUser;
    const messages = {};
    let isFormValid = true;
    if (!email.value) {
      messages.email = email.touched ? "Email is required" : "";
      isFormValid = false;
    }
    if (!password.value) {
      messages.password = password.touched ? "Password is required" : "";
      isFormValid = false;
    }
    return { fieldFeedback: messages, isFormValid };
  }, [loginUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      email: { value: email },
      password: { value: password },
    } = loginUser;
    dispatchSignInUser({ email, password });
  };

  return (
    <main className="form-signin w-100 m-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal text-center">Login</h1>
        <div className="form-floating">
          <input
            type="email"
            autoComplete="new-email"
            name="email"
            className="form-control" 
            value={email.value}
            onChange={updateLoginUser}
            invalid={!!fieldFeedback.email}
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            className="form-control" 
            name="password"
            value={password.value}
            onChange={updateLoginUser}
            invalid={!!fieldFeedback.password}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        {error && (
          <FormFeedback className={`mt-3 d-block`}>{error}</FormFeedback>
        )}
        <button
          disabled={!isFormValid || loading}
          className="w-100 btn btn-lg btn-primary"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </main>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchSignInUser: async (userInput) => dispatch(signInUser(userInput)),
});

export default connect(() => ({}), mapDispatchToProps)(Login);
