import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function getAuthHeader() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getProducts() {
    const res = await axios.get(
        `${apiUrl}/products`,
        getAuthHeader()
    );

    return res.data.data;
}

export async function createProduct(
  payload: {
    name: string;
    image: File;
  }
) {
  const formData = new FormData();

  formData.append(
    "name",
    payload.name
  );

  formData.append(
    "image",
    payload.image
  );

  const res = await axios.post(
    `${apiUrl}/products`,
    formData,
    {
      ...getAuthHeader(),

      headers: {
        ...getAuthHeader().headers,

        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data.data;
}

export async function searchProducts(keyword: string) {
  const res = await axios.get(
    `${apiUrl}/products/search?keyword=${keyword}`,
    getAuthHeader()
  );

  return res.data.data;
}