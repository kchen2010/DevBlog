import { lazy, Suspense } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./AuthContext";
import Background from "./components/Background";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Loading = () => (
  <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
    Loading...
  </div>
);

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="app-container">
      <Background />

      <nav style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: "30px", padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100
      }}>
        <Link to="/" style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ddd" }}>~/home</Link>
        {user ? (
          <>
            <Link to="/admin" style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ddd" }}>./admin</Link>
            <button
              onClick={handleLogout}
              style={{
                fontSize: "0.85rem", padding: "6px 14px",
                border: "1px solid #ef4444", color: "#ef4444",
                background: "transparent", cursor: "pointer"
              }}
            >
              logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ddd" }}>./login</Link>
        )}
      </nav>

      <div style={{ position: "relative", color: "white" }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
