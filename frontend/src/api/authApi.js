import api from "../services/api";

const register = async (credentials) => {
  try {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "User Registration failed"
    );
  }
};

const login = async (credentials) => {
  try {
    const response = await api.post("/auth/signin", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "User Login failed");
  }
};

export { register, login };
