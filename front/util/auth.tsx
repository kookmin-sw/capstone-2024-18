import axios from "axios";

interface Mode {
  mode: "SIGN_UP" | "LOG_IN"
}

const authenticate = async (mode: Mode, userId: string, password: string) => {
  const endpoint = "";
  const body = {
    userId: userId,
    password: password
  };
  const response = await axios.post(endpoint, body);
  const accessToken = response.data.accessToken;
  console.log('Access Token:', accessToken);
  return accessToken;
} 

const googleLogin = async () => {
  
  try {
    const endpoint = "http://localhost:8080/oauth/google/login-uri?redirect-uri=http://localhost:8080/index.html";
    const response = await axios.get(endpoint);
    const url = new URL(response.data);
    const params = new URLSearchParams(url.search);
    console.log(params);
    // const code = params.get('code');
    // const response2 = await axios.post("http://localhost:8080/oauth/google/login", {
    //   "redirectUri": "http://localhost:8080/index.html",
    //   "code": code
    // });
    // const {access_token, refresh_token} = response2.data
  } catch (e) {

  }

}