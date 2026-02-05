import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await addDoc(collection(db, "subscribers"), {
        email: email,
        joinedAt: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("error");
    }
  };

  return (
    <div className="glass-panel" style={{ textAlign: "center" }}>
      <h3 style={{ marginTop: 0, color: "#c084fc" }}>subscribe(updates)</h3>
      <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "16px" }}>
        // get notified when new posts drop
      </p>
      <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ flex: 1, maxWidth: "280px", marginBottom: 0 }}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "success" && (
        <p style={{ color: "#4ade80", fontSize: "0.9rem", marginBottom: 0 }}>Subscribed successfully.</p>
      )}
      {status === "error" && (
        <p style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: 0 }}>Something went wrong. Try again.</p>
      )}
    </div>
  );
};

export default SubscribeForm;
