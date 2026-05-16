import { useState } from "react";

import { addActor } from "../../services/actor";

import "./AddActor.css";

import Sidebar from "../../components/sidebar/sidebar";

export default function AddActor() {
  const [form, setForm] = useState({
    blockchainAddress: "",
    actorName: "",
    role: "GROWER",
    locationName: "",
    address: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      await addActor({
        blockchainAddress:
          form.blockchainAddress,

        actorName: form.actorName,

        role: form.role,

        location: {
          locationName:
            form.locationName,

          address: form.address,
        },
      });

      alert("Actor added!");
    } catch (err) {
      console.error(err);
    }
  }

return (
  <div className="dashboard-layout">
    <Sidebar />

    <div className="dashboard-content">
      <div className="add-actor-page">
        <div className="add-actor-card">
          <div className="form-header">
            <h2>Add Actor</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="actor-form"
          >
            <div className="form-group">
              <label>
                Blockchain Address
              </label>

              <input
                type="text"
                name="blockchainAddress"
                placeholder="0x..."
                value={
                  form.blockchainAddress
                }
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="actorName"
                value={form.actorName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="GROWER"
                    checked={
                      form.role ===
                      "GROWER"
                    }
                    onChange={handleChange}
                  />

                  GROWER
                </label>

                <label>
                  <input
                    type="radio"
                    name="role"
                    value="DISTRIBUTOR"
                    checked={
                      form.role ===
                      "DISTRIBUTOR"
                    }
                    onChange={handleChange}
                  />

                  DISTRIBUTOR
                </label>

                <label>
                  <input
                    type="radio"
                    name="role"
                    value="RETAILER"
                    checked={
                      form.role ===
                      "RETAILER"
                    }
                    onChange={handleChange}
                  />

                  RETAILER
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>
                Location Name
              </label>

              <input
                type="text"
                name="locationName"
                value={
                  form.locationName
                }
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Location Address
              </label>

              <textarea
                name="address"
                rows={4}
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="submit-button"
            >
              ADD
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}