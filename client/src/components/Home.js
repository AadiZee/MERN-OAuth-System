function Home({ user, onLogout }) {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Welcome, {user.name}!</h1>

      {user.avatar && (
        <img
          src={user.avatar}
          alt="Profile"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            margin: "20px",
          }}
        />
      )}

      <div style={{ margin: "20px 0" }}>
        <p>
          <strong>Email:</strong> {user.email || "Not provided"}
        </p>
        <p>
          <strong>Mobile:</strong> {user.mobile || "Not provided"}
        </p>
        <p>
          <strong>Providers:</strong>{" "}
          {user.providers?.map((p) => p.name).join(", ")}
        </p>
      </div>

      <button
        onClick={onLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
