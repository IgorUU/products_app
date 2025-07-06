import api from './api';

type LoginCredentials = {
  username: string;
  password: string;
}

type LoginResponse = {
  token: string;
}

type UserResponse = {
  authenticated: boolean;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post("/api/login", credentials);
  return response.data;
}

export const logoutUser = async () => {
  await api.post("/api/logout");
}

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get("/api/user");
  return response.data;
};
