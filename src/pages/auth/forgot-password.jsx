import { forgotPassword } from "../../apis/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgot-password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) {
      setError("Email is required");
      return;
    }
    try {
      const data = await forgotPassword(email);
      setMessage(data.message || "Check your email for reset instructions.");
    } catch (err) {
        setError(err);
    }
    };
    return (
    <div className="forgot-password-form-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <label className="email-label">Email:</label>
        <input
          name="email"  
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
        />
        <button type="submit">Submit</button>
        {message && <div style={{ color: "green" }}>{message}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <a href="/login" className="back-to-login-link">
          Back to Login
        </a>
      </form>
    </div>
  );
};

export default ForgotPassword;