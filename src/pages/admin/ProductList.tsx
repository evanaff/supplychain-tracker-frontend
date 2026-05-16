import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/sidebar";

import "./ProductList.css";
import { getProducts } from "../../services/product";

interface Product {
  gtin: string;
  name: string;
  imageUrl: string;
}

export default function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  async function fetchProducts() {
    try {
      const data = await getProducts();

      console.log(data);

      setProducts(data);

      if (
        data.length > 0
      ) {
        setSelectedProduct(
          data[0]
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="products-layout">
          <div className="products-card">
            <div className="products-header">
              <h2>Products</h2>

              <button
                className="create-product-btn"
                onClick={() =>
                  navigate("/admin/create-product")
                }
              >
                Create Product
              </button>
            </div>

            <table className="products-table">
              <thead>
                <tr>
                  <th>GTIN</th>

                  <th>Name</th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => (
                    <tr
                      key={product.gtin}
                      onClick={() =>
                        setSelectedProduct(
                          product
                        )
                      }
                      className="product-row"
                    >
                      <td>
                        {product.gtin}
                      </td>

                      <td>
                        {product.name}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="product-preview">
            {selectedProduct ? (
              <img
                src={
                  selectedProduct.imageUrl
                }
                alt={
                  selectedProduct.name
                }
              />
            ) : (
              <div className="empty-preview">
                Product Image
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}