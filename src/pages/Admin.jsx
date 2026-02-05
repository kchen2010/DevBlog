import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { db, auth } from "../firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, onSnapshot, query, orderBy
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: "success" | "error" }
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // Fetch posts real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("Date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(Boolean);

    try {
      if (editingId) {
        await updateDoc(doc(db, "posts", editingId), {
          Title: title,
          Content: content,
          Tags: tagsArray,
        });
        showToast("Post updated successfully.");
      } else {
        await addDoc(collection(db, "posts"), {
          Title: title,
          Content: content,
          Tags: tagsArray,
          Date: serverTimestamp(),
        });
        showToast("Post published.");
      }
      resetForm();
    } catch (error) {
      console.error("Error: ", error);
      showToast("Failed to save post.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      if (editingId === id) resetForm();
      showToast("Post deleted.");
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Failed to delete post.", "error");
    }
  };

  const loadPost = (post) => {
    setTitle(post.Title);
    setContent(post.Content);
    setTags(Array.isArray(post.Tags) ? post.Tags.join(", ") : post.Tags);
    setEditingId(post.id);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setEditingId(null);
  };

  if (authLoading) return <div style={{ textAlign: "center", padding: "60px" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px", display: "flex", gap: "30px" }}>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", top: "80px", right: "20px", zIndex: 200,
          padding: "12px 20px", borderRadius: "6px",
          background: toast.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(74, 222, 128, 0.15)",
          border: `1px solid ${toast.type === "error" ? "#ef4444" : "#4ade80"}`,
          color: toast.type === "error" ? "#ef4444" : "#4ade80",
          fontSize: "0.9rem",
          animation: "fadeIn 0.2s ease"
        }}>
          {toast.message}
        </div>
      )}

      {/* Left sidebar */}
      <div style={{ width: "250px", flexShrink: 0 }}>
        <h3 style={{ color: "#94a3b8", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
          Project_Files
        </h3>

        <button
          onClick={resetForm}
          style={{ width: "100%", marginBottom: "15px", border: "1px dashed #4ade80", color: "#4ade80" }}
        >
          + New File
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                padding: "10px",
                background: editingId === post.id ? "rgba(34, 211, 238, 0.1)" : "rgba(30, 41, 59, 0.5)",
                border: editingId === post.id ? "1px solid #22d3ee" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onClick={() => loadPost(post)}
            >
              <span style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
                {post.Title}
              </span>
              <span
                onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                style={{ color: "#ef4444", fontWeight: "bold", padding: "0 5px", cursor: "pointer" }}
                title="Delete"
              >
                ×
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <h1 style={{ marginTop: 0 }}>
          {editingId ? `Editing: ${title}` : "Create New Post"}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px" }}
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ padding: "10px" }}
          />

          {/* Split screen editor */}
          <div style={{ display: "flex", gap: "20px", height: "500px" }}>
            <textarea
              placeholder="Write your markdown here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                flex: 1, padding: "15px",
                fontFamily: "'JetBrains Mono', monospace",
                resize: "none", fontSize: "0.9rem", lineHeight: "1.5"
              }}
            />

            <div style={{
              flex: 1, padding: "20px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px", overflowY: "auto",
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              color: "#e2e8f0"
            }}>
              <div className="markdown-preview" style={{ lineHeight: "1.6" }}>
                {content ? <ReactMarkdown>{content}</ReactMarkdown> : <span style={{ color: "#64748b" }}>Preview...</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                flex: 1, padding: "15px",
                backgroundColor: editingId ? "#c084fc" : "#007bff",
                color: "white", border: "none"
              }}
            >
              {editingId ? "Update Post" : "Publish Post"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ flex: 0.2, backgroundColor: "#64748b", border: "none", color: "white" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
