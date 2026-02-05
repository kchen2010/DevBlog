import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "80px 20px" }}>
    <h1 style={{ fontSize: "4rem", margin: "0", color: "#c084fc" }}>404</h1>
    <p style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "30px" }}>
      // page_not_found: no matching route
    </p>
    <Link to="/">← Return to ~/home</Link>
  </div>
);

export default NotFound;
