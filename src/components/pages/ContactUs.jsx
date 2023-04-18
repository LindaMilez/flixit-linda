import { useMemo, useState } from "react";
import { useForm } from "../../utils/useForm";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

const ContactUs = () => {
  const [visitor, updateVisitor] = useForm();
  const [loading, setLoading] = useState(false);

  const { name = {}, email = {}, query = {} } = visitor;

  const { fieldFeedback, isFormValid } = useMemo(() => {
    const { email = {}, name = {}, query = {} } = visitor;
    const messages = {};
    let isFormValid = true;
    if (!name.value) {
      messages.name = name.touched ? "Name is required" : "";
      isFormValid = false;
    }
    if (!email.value) {
      messages.email = email.touched ? "Email is required" : "";
      isFormValid = false;
    }
    if (!query.value) {
      messages.query = query.touched
        ? "Enter your initial query to get started with."
        : "";
      isFormValid = false;
    }
    return { fieldFeedback: messages, isFormValid };
  }, [visitor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name: { value: name },
      email: { value: email },
      query: { value: query },
    } = visitor;
    try {
      setLoading(true);
      const response = await apiClient({
        method: "POST",
        url: "/app/enquiry",
        data: { name, email, query },
      });
      console.log("Enquery details: ", response.data);
      toast(`Enquiry saved successfully.`, { type: "success" });
    } catch (error) {
      toast(error.message, { type: "error" });
    }
    setLoading(false);
  };

  return (
    <div class="container col-xl-10 col-xxl-8 px-4 py-5">
      <div class="row align-items-center g-lg-5 py-5">
        <div class="col-lg-7 text-center text-lg-start">
          <h1 class="display-4 fw-bold lh-1 mb-3">Contact Us</h1>
          <p class="col-lg-10 fs-4 mb-0">
            Please enter your details in the form.
          </p>
          <p class="col-lg-10 mb-0 fs-4">
            We will reach out to you at the earliest.
          </p>
        </div>
        <div class="col-md-10 mx-auto col-lg-5">
          <form
            class="p-4 p-md-5 border rounded-3 bg-light"
            onSubmit={handleSubmit}
          >
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                placeholder="Full name"
                value={name.value}
                onChange={updateVisitor}
                invalid={!!fieldFeedback.name}
              />
              <label for="name">Name</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={email.value}
                onChange={updateVisitor}
                invalid={!!fieldFeedback.email}
              />
              <label for="email">Email address</label>
            </div>
            <div class="form-floating mb-3">
              <textarea
                class="form-control"
                id="query"
                name="query"
                value={query.value}
                onChange={updateVisitor}
                invalid={!!fieldFeedback.query}
                rows={3}
                placeholder=""
              ></textarea>
              <label for="query">Query</label>
            </div>
            <button
              disabled={loading || !isFormValid}
              class="w-100 btn btn-lg btn-primary d-flex gap-3 align-items-center justify-content-center"
              type="submit"
            >
              {loading && (
                <Spinner as="span" animation="border" role="status" size="sm" />
              )}
              <span>Send Enquery</span>
            </button>
            <hr class="my-4" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
