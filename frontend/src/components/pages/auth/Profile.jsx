// reactstrap components
import { useEffect, useMemo, useState } from "react";
import { Container, FormFeedback, Spinner } from "reactstrap";
import { useForm } from "../../../utils/useForm";
import { getSignInUser, updateUserInfo } from "./authActions";
import Navbar from "../../common/Navbar";

const Profile = ({ filter }) => {
  const [newUser, updateNewUser, onFocusOut] = useForm();

  const [loading, toggleLoading] = useState(false);
  const [formFeedback, setFeedback] = useState({});
  const [oldUserData, setUserData] = useState({});
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      const userInfo = await getSignInUser();
      setUserData(userInfo);
      setUserLoading(false);
    };
    fetchUser();
  }, []);

  const { fieldFeedback, isFormValid } = useMemo(() => {
    const {
      username = {},
      email = {},
      password = {},
      address = {},
      city = {},
      country = {},
      postalCode = {},
    } = newUser;
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
    if (!address.value) {
      messages.address = address.touched ? "Address is required" : "";
      isFormValid = false;
    }
    if (!city.value) {
      messages.city = city.touched ? "City is required" : "";
      isFormValid = false;
    }
    if (!country.value) {
      messages.country = country.touched ? "Country is required" : "";
      isFormValid = false;
    }
    if (!postalCode.value) {
      messages.postalCode = postalCode.touched ? "Postal code is required" : "";
      isFormValid = false;
    }
    return { fieldFeedback: messages, isFormValid };
  }, [newUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toggleLoading(true);
    setFeedback({});
    const {
      username: { value: username } = {},
      password: { value: password } = {},
      email: { value: email } = {},
      address: { value: address } = {},
      city: { value: city } = {},
      country: { value: country } = {},
      postalCode: { value: postalCode } = {},
    } = newUser;
    try {
      await updateUserInfo({
        username,
        password,
        email,
        address,
        city,
        country,
        postalCode,
      });
      setFeedback({
        type: "success",
        message: <span>User information updated successfully.</span>,
      });
    } catch (error) {
      setFeedback({ type: "danger", message: error.message });
    }
    toggleLoading(false);
  };

  if (userLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner as="span" animation="border" role="status" size="sm" />
      </Container>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <Navbar filter={filter} />
        <main className="form-signin w-100 m-auto">
          <form onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 fw-normal text-center">Update user info</h1>
            <div className="form-floating">
              <input
                placeholder="Name"
                type="text"
                name="username"
                defaultValue={oldUserData.username}
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
                defaultValue={oldUserData.email}
                onChange={updateNewUser}
                onBlur={onFocusOut}
                invalid={!!fieldFeedback.email}
                className="form-control"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email</label>
            </div>
            <div className="form-floating">
              <input
                placeholder="Password"
                type="password"
                defaultValue={oldUserData.password}
                autoComplete="new-password"
                name="password"
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
                defaultValue={oldUserData.address}
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
                type="text"
                autoComplete="new-password"
                name="city"
                defaultValue={oldUserData.city}
                onChange={updateNewUser}
                onBlur={onFocusOut}
                invalid={!!fieldFeedback.city}
                className="form-control"
                placeholder="City"
              />
              <label htmlFor="floatingInput">City</label>
            </div>
            <div className="form-floating">
              <input
                placeholder="Country"
                type="text"
                autoComplete="new-password"
                name="country"
                defaultValue={oldUserData.country}
                onChange={updateNewUser}
                onBlur={onFocusOut}
                invalid={!!fieldFeedback.country}
                className="form-control"
              />
              <label htmlFor="floatingPassword">Country</label>
            </div>
            <div className="form-floating">
              <input
                placeholder="Postalcode"
                type="text"
                autoComplete="new-password"
                name="postalCode"
                defaultValue={oldUserData.postalCode}
                onChange={updateNewUser}
                onBlur={onFocusOut}
                invalid={!!fieldFeedback.postalCode}
                className="form-control"
              />
              <label htmlFor="floatingPassword">Postal code</label>
            </div>

            {formFeedback.type && (
              <FormFeedback
                className={`mt-3 d-block text-${formFeedback.type}`}
              >
                {formFeedback.message}
              </FormFeedback>
            )}
            <button
              disabled={loading || !isFormValid}
              className="w-100 btn btn-lg btn-primary justify-content-center gap-3 d-flex align-items-center"
              type="submit"
            >
              {loading && (
                <Spinner as="span" animation="border" role="status" size="sm" />
              )}
              <span>Update</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
