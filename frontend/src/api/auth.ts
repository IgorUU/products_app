import api from './api';

type LoginCredentials = {
  username: string;
  password: string;
}

type LoginResponse = {
  token: string;
}
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post("/api/login", credentials);
  return response.data;
}

export const logoutUser = async () => {
  await api.post("/api/logout");
}
