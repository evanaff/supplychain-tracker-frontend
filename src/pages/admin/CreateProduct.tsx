import { useState } from "react";

import Sidebar from "../../components/sidebar/sidebar";

import "./CreateProduct.css";
import { createProduct } from "../../services/product";

export default function CreateProduct() {
  const [name, setName] = useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [toast, setToast] = useState("");

  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

const showToast = (
  message: string,
  type: "success" | "error" | "info"
) => {
  setToast(message);

  setToastType(type);

  setTimeout(() => {
    setToast("");
  }, 3000);
};

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      if (!image) {
        showToast(
          "Image required",
          "error"
        );

        return;
      }

      await createProduct({
        name,
        image,
      });

      const formData = new FormData();

      formData.append("name", name);

      formData.append("image", image);

    showToast(
    "Product created successfully",
    "success"
    );

      setName("");

      setImage(null);

      setPreview("");
    } catch (err) {
      console.error(err);
    }
  }

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="create-product-page">
          <div className="create-product-card">
            <div className="form-header">
              <h2>Create Product</h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="product-form"
            >
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Image</label>

                <label className="image-upload">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                    />
                  ) : (
                    <div className="upload-placeholder">
                      Upload Image
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    hidden
                  />
                </label>
              </div>

              <button
                type="submit"
                className="submit-button"
              >
                CREATE
              </button>
            </form>
          </div>
        </div>
            {toast && (
                <div
                className={`toast toast-${toastType}`}
                >
                {toast}
                </div>
            )}
      </div>
    </div>
  );
}