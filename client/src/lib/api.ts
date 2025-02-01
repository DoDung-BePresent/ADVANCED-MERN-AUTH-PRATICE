import API from "./axios-client";

type LoginType = {
  email: string;
  password: string;
};

type RegisterType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const loginMutationFn = async (data: LoginType) => {
  const res = await API.post(`/auth/login`, data);
  return res.data;
};

export const registerMutationFn = async (data: RegisterType) => {
  const res = await API.post(`/auth/register`, data);
  return res.data;
};

export const getCurrentUserQueryFn = async () => {
  const res = await API.get(`/user/current`);
  return res.data;
};
