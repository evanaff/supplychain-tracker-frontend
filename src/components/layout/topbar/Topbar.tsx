import "./Topbar.css";

import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

interface TopbarProps {
  role:
    | "ADMIN"
    | "GROWER"
    | "DISTRIBUTOR"
    | "RETAILER";
}

function Topbar({ role }: TopbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();

    navigate("/login");
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>
          Supply Chain Tracker
        </h1>
      </div>

      <div className="topbar-right">
        <div className="role-badge">
          {role}
        </div>

        <button
          className="topbar-logout"
          onClick={handleLogout}
        >
          <FiLogOut />

          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;