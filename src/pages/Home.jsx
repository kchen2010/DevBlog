import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import SubscribeForm from "../components/SubscribeForm";

const getReadingTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const getThumbnail = (markdown) => {
  const imgMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
  return imgMatch ? imgMatch[1] : null;
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("Date", "desc"));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach((post) => {
      if (post.Tags) post.Tags.forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet];
  }, [posts]);

  // Filter posts by active tag and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = !activeTag || (post.Tags && post.Tags.includes(activeTag));
      const matchesSearch = !searchQuery ||
        post.Title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [posts, activeTag, searchQuery]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading projects...</h2>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>

      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          <span style={{ color: "#c084fc" }}>const</span> dev_projects = [];
        </h1>
        <p style={{ color: "#94a3b8" }}>// Click a card to read the full log</p>
      </header>

      {/* Search bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: "400px", margin: "0 auto", display: "block" }}
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "30px" }}>
          <button
            onClick={() => setActiveTag(null)}
            style={{
              fontSize: "0.8rem", padding: "4px 12px",
              border: !activeTag ? "1px solid #22d3ee" : "1px solid #334155",
              color: !activeTag ? "#22d3ee" : "#94a3b8",
              background: !activeTag ? "rgba(34, 211, 238, 0.1)" : "transparent",
            }}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              style={{
                fontSize: "0.8rem", padding: "4px 12px",
                border: activeTag === tag ? "1px solid #22d3ee" : "1px solid #334155",
                color: activeTag === tag ? "#22d3ee" : "#94a3b8",
                background: activeTag === tag ? "rgba(34, 211, 238, 0.1)" : "transparent",
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Post grid */}
      {filteredPosts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>
          // no posts found matching query
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
          {filteredPosts.map((post) => {
            const thumbnail = getThumbnail(post.Content);
            const readTime = getReadingTime(post.Content);

            return (
              <Link to={`/post/${post.id}`} key={post.id} style={{ textDecoration: "none" }}>
                <div className="glass-panel" style={{
                  height: "100%",
                  display: "flex", flexDirection: "column",
                  padding: "0", overflow: "hidden"
                }}>

                  {thumbnail ? (
                    <div style={{
                      height: "180px",
                      backgroundImage: `url(${thumbnail})`,
                      backgroundSize: "cover", backgroundPosition: "center",
                      borderBottom: "1px solid rgba(255,255,255,0.1)"
                    }} />
                  ) : (
                    <div style={{ height: "100px", background: "linear-gradient(45deg, rgba(30,41,59,0), rgba(34,211,238,0.1))" }} />
                  )}

                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ margin: "0 0 8px 0", fontSize: "1.4rem", color: "#e2e8f0" }}>{post.Title}</h2>

                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "12px" }}>
                      {readTime} min read
                    </span>

                    <div style={{ marginTop: "auto" }}>
                      {post.Tags && post.Tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          fontSize: "0.75rem", color: "#94a3b8", marginRight: "8px",
                          background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px"
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Subscribe section */}
      <div style={{ marginTop: "60px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
        <SubscribeForm />
      </div>
    </div>
  );
};

export default Home;
