import axios, { AxiosError } from 'axios';
import { useContext } from "react";
import AuthContext from "../store/auth-context";

const LOCALHOST = "https://1308-115-138-61-136.ngrok-free.app";

// 3. OK
export const findEmail = async (email: string) => {
  const endpoint = `${LOCALHOST}/auth/find-email?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    console.log(response.data);
    const { recievedEmail, isRegistered } = response.data;
  }
  catch (e) {
    console.log(e);
  }
}

// 4. OK
export const sendTemporaryPassword = async (email: string) => {
  const endpoint = `${LOCALHOST}/auth/send-temporary-password?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    console.log(response.data);
  }
  catch (e) {
    console.log(e);
  }
}

// 5. OK
export const verifyTemporaryPassword = async (email: string, temPassword: string, newPassword: string, newPassword2: string) => {
  const endpoint = `${LOCALHOST}/auth/verify-temporary-password?email=${email}&temporaryPassword=${temPassword}`;
  const body = { newPassword, newPassword2, }
  try {
    const response = await axios.post(endpoint, body);
    console.log(response.data);
  }
  catch (e) {
    console.log(e);
  }
}

// 6. OK
export const verifyDuplicationEmail = async (email: string) => {
  const endpoint = `${LOCALHOST}/auth/verify-duplication?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    console.log(response.data);
    return response.data;
  }
  catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      console.log("이미 사용중인 이메일입니다.");
      return "이미 사용중인 이메일입니다.";
    }
    else console.log(e);
  }
}

// 7. OK
export const sendCode = async (email: string) => {
  const endpoint = `${LOCALHOST}/auth/send-code?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    return "이메일로 인증코드를 전송했습니다.";
  }
  catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      return "이미 사용중인 이메일입니다.";
    }
    else {
      console.log(e);
      return e;
    }
  }
}

// 8. X
export const verifyCode = async (email: string, code: string) => {
  const endpoint = `${LOCALHOST}/auth/verify-code?email=${email}&code=${code}`;

  try {
    const response = await axios.get(endpoint);
    console.log(response.data);
  }
  catch (e) {
    console.log(e);
  }
}

// 9. OK
export const signup = async (email: string, password: string, password2: string, isVerified: boolean) => {
  const endpoint =  `${LOCALHOST}/auth/signup`;
  const body = {
    email,
    password,
    password2,
    isVerified,
  }

  try {
    const response = await axios.post(endpoint, body);
    console.log(response.data);
  }
  catch (e) {
    console.log(e);
  }
}