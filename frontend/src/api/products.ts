import api from "./api";

export const fetchProducts = async() => {
  const token = localStorage.getItem("token");
  const response = await api.get("/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
