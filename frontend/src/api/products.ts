import api from "./api";

export const fetchProducts = async(params?: { category?: string; search?: string }) => {
  const response = await api.get("/api/products", { params });
  return response.data;
}

export const fetchCategories = async () => {
  const response = await api.get("api/categories");
  return response.data;
}
