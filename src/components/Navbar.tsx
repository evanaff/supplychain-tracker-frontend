import { useNavigate } from "react-router-dom";

import { LogOut } from "lucide-react";

import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar__logo">
        Supply Chain Tracker
      </div>

      {/* RIGHT */}
      <div className="navbar__right">
        {token && (
          <>
            <span className="navbar__role">
              {role}
            </span>

            <button
              className="navbar__logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />

              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}