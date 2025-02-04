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

type ForgotPassword = {
  email: string;
};

type ResetPassword = {
  password: string;
  verificationCode: string;
};

type MfaType = {
  message: string;
  secretKey: string;
  qrCodeUrl: string;
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

export const logoutMutationFn = async () => await API.post(`/auth/logout`);

export const forgotPasswordMutationFn = async (data: ForgotPassword) => {
  const res = await API.post(`/auth/password/forgot`, data);
  return res.data;
};

export const resetPasswordMutationFn = async (data: ResetPassword) => {
  const res = await API.post(`/auth/password/reset`, data);
  return res.data;
};

export const mfaSetupQueryFn = async () => {
  const res = await API.get<MfaType>(`/mfa/setup`);
  return res.data;
};
