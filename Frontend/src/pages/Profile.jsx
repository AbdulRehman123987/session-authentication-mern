import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            margin: "0 auto 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "36px",
            fontWeight: "bold",
            color: "#fff",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h1
          style={{
            color: "#fff",
            marginBottom: "10px",
            fontSize: "2rem",
          }}
        >
          Welcome, {user?.name} 👋
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            marginBottom: "30px",
          }}
        >
          Your profile information
        </p>

        {/* User Info */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Full Name
            </p>
            <h3 style={{ color: "#fff", margin: 0 }}>{user?.name || "N/A"}</h3>
          </div>

          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Email Address
            </p>
            <h3
              style={{
                color: "#fff",
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {user?.email || "N/A"}
            </h3>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
