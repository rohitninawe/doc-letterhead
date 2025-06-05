import React, { useState } from "react";

const PasswordGate = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");

  const PASSWORD = ""; // ❌ don't put this in .env

  const handleSubmit = () => {
    if (input === PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (authenticated) return children;

  return (
    <div style={{ padding: 50 }}>
      <h2>Enter Password to Access</h2>
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: 20, padding: 10 }}>
        Enter
      </button>
    </div>
  );
};

export default PasswordGate;
