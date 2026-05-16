import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActors,
} from "../../services/actor";

import "./ActorList.css";

import Sidebar from "../../components/sidebar/sidebar";

interface Actor {
  blockchainAddress: string;
  name: string;
  role: string;
  gln: string;
}

export default function ActorList() {
  const [actors, setActors] = useState<Actor[]>([]);

  const navigate = useNavigate();

  async function fetchActors() {
    try {
      const data = await getActors();

      setActors(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchActors();
  }, []);

  const growers = actors.filter(
    (a) => a.role === "GROWER"
  ).length;

  const distributors = actors.filter(
    (a) => a.role === "DISTRIBUTOR"
  ).length;

  const retailers = actors.filter(
    (a) => a.role === "RETAILER"
  ).length;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
        </div>
      </div>

      {/* MAIN */}
      <main className="main-content">
        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{growers}</h2>

            <p>Growers</p>
          </div>

          <div className="stat-card">
            <h2>{distributors}</h2>

            <p>Distributors</p>
          </div>

          <div className="stat-card">
            <h2>{retailers}</h2>

            <p>Retailers</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div className="table-header">
            <h3>Actors</h3>

            <button className="add-button"
            onClick={() => {
              navigate("/admin/add-actor")
            }}>
              Add Actor 
            </button>
          </div>

          <table className="actor-table">
            <thead>
              <tr>
                <th>
                  Blockchain Address
                </th>

                <th>Name</th>

                <th>GLN</th>

                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {actors.map((actor) => (
                <tr
                  key={
                    actor.blockchainAddress
                  }
                >
                  <td>
                    {
                      actor.blockchainAddress
                    }
                  </td>

                  <td>{actor.name}</td>

                  <td>{actor.gln}</td>

                  <td>{actor.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}