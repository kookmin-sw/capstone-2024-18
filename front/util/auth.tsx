import axios, { AxiosError } from 'axios';

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
  }
  catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      console.log("이미 사용중인 이메일입니다.");
    }
    else console.log(e);
  }
}

// 7. OK
export const sendCode = async (email: string) => {
  const endpoint = `${LOCALHOST}/auth/send-code?email=${email}`;
  try {
    const response = await axios.post(endpoint);
    console.log(response.data);
  }
  catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      console.log("이미 사용중인 이메일입니다.");
    }
    else console.log(e);
  }
}

// 8. X
export const verifyCode = async (email: string, code: string) => {
  const endpoint = `${LOCALHOST}/auth/verify-code?email=${email}&code=${code}`;

  try {
    const response = await axios.post(endpoint);
    console.log(response.data);
  }
  catch (e) {
    console.log(e);
  }
}

// 9. OK
export const signup = async (email: string, password: string, password2: string, isVerified: true) => {
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

// 10. 토큰 로직
export const signin = async (email: string, password: string) => {
  const endpoint =  `${LOCALHOST}/auth/signin`;
  const body = {
    email,
    password,
  }

  try {
    const response = await axios.post(endpoint, body);
    const { accessToken, refreshToken } = response.data;
    // token 다루는 로직
    console.log(accessToken, refreshToken);
  }
  catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      console.log("이메일 또는 비밀번호가 잘못되었습니다.");
    }
    else console.log(e);
  }
}

// 11. OK
export const signout = async (accessToken: string) => {
  const endpoint =  `${LOCALHOST}/members/signout`;
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.delete(endpoint, config);
    console.log(response.data);
    // token 삭제 로직
  }
  catch (e) {
    console.log(e);
  }
}

// 12. 토큰 구현
export const reissue = async (accessToken: string, refreshToken: string) => {
  const endpoint =  `${LOCALHOST}/members/reissue`;
  const body = { refreshToken };
  const config = { 
    headers: { Authorization: 'Bearer ' + accessToken } 
  };
  try {
    const response = await axios.post(endpoint, body, config);
    const { receivedAccessToken, receivedRefreshToken } = response.data;
  }
  catch (e) {
    console.log(e);
  }
}