import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ReactMarkdown from "react-markdown";

const getReadingTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docSnap = await getDoc(doc(db, "posts", id));
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading entry...</h2>;
  if (!post) return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Post not found.</h2>
      <Link to="/" style={{ color: "#94a3b8" }}>← Back to Home</Link>
    </div>
  );

  const readTime = getReadingTime(post.Content);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

      <Link to="/" style={{ display: "inline-block", marginBottom: "20px", color: "#94a3b8" }}>
        ← Back to Home
      </Link>

      <div className="glass-panel">
        <h1 style={{ fontSize: "2.5rem", marginTop: 0 }}>{post.Title}</h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", color: "#94a3b8", fontSize: "0.9rem", flexWrap: "wrap", alignItems: "center" }}>
          <span>{post.Date?.toDate().toDateString()}</span>
          <span>·</span>
          <span>{readTime} min read</span>
          {post.Tags && post.Tags.length > 0 && (
            <>
              <span>·</span>
              {post.Tags.map(tag => (
                <span key={tag} style={{ color: "#22d3ee" }}>#{tag}</span>
              ))}
            </>
          )}
        </div>

        <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: "30px" }} />

        <div className="markdown-preview" style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
          <ReactMarkdown>{post.Content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
