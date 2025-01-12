import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register } from "../api/authApi";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (data) => {
      const { token, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (err) => {
      setError(err?.message || "Login Failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials) => register(credentials),
    onSuccess: (data) => {
      const { token, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (err) => {
      setError(err?.message || "Registration Failed");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
  };
};
