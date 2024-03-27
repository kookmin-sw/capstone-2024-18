import Config from 'react-native-config';

import axios from 'axios';
import { Linking } from 'react-native';
import { useEffect } from 'react';
import 'react-native-url-polyfill/auto';
import GoogleLogin from './pages/test';

const LOCALHOST = Config.LOCALHOST;

// ngrok http 8080
const LOCALHOST2 = "https://7bf8-115-138-61-136.ngrok-free.app";

const getLoginPage = async () => {
  try {
    console.log("getLoginPage");

    const endpoint = LOCALHOST + "oauth/google/login-uri?redirect-uri=" + LOCALHOST2;
    const response = await axios.get(endpoint);
    const loginUri = response.data.loginUri;
    console.log(loginUri);
    // loginUri
    // https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=http://192.168.123.106:8080/&response_type=code&scope=email profile 
    
    // https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=https://0744-115-138-61-136.ngrok-free.app&response_type=code&scope=email profile
    linkLoginPage(loginUri);
  } 
  catch (e) {
    console.log(e);
  }
}

const linkLoginPage = (loginUri: string) => {
  console.log("linkLoginPage");
  // 실행 되는거
  // const uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=http://localhost:8080/index.html&response_type=code&scope=email profile";

  // 내가 얻은거
  // const uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=http://192.168.123.106:8080/&response_type=code&scope=email profile"


  const uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=https://0744-115-138-61-136.ngrok-free.app&response_type=code&scope=email profile";

  Linking.openURL(loginUri).catch(err => console.error('Error opening URI:', err));

  // redirect
  // http://localhost:8080/index.html?code=4%2F0AeaYSHD9_HYTAkVnVIfhrWwJ-wpCQrax_QLrrD8Aj7qnJY5cFEJcIjPHS5dmzFYEfFewuw&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent

  // facefriend://redirect?code=4%2F0AeaYSHD9_HYTAkVnVIfhrWwJ-wpCQrax_QLrrD8Aj7qnJY5cFEJcIjPHS5dmzFYEfFewuw&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent
}

const googleLogin = async () => {
  console.log("googleLogin");
  const redirectUri = "http://localhost:8080/index.html";
  const code = "4%2F0AeaYSHD9_HYTAkVnVIfhrWwJ-wpCQrax_QLrrD8Aj7qnJY5cFEJcIjPHS5dmzFYEfFewuw";

  // const url = "http://localhost:8080/oauth/google/login"; network error
  const url = LOCALHOST + "oauth/google/login";

  try {
    const response = await axios.post(url, {
      redirectUri: redirectUri,
      code: code,
    })
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

const emailSignin = async () => {
  console.log("email1");
  try {
    // const response = await axios.post("http://localhost:8080/members/send-code?email=nanana3679");
    // const response = await axios.post("http://10.0.2.2:8080/members/send-code?email=nanana3679");

    const response = await axios.post(LOCALHOST + "auth/signup", {
      "email":"nanana3678",
      "password":"123",
      "password2":"123",
      "isVerified":"true"
    });

    
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}

const sendCode = async () => {
  console.log("sendCode");
  try {
    // const response = await axios.post("http://localhost:8080/members/send-code?email=nanana3679");
    // const response = await axios.post("http://10.0.2.2:8080/members/send-code?email=nanana3679");

    const response = await axios.post(LOCALHOST + "auth/send-code?email=nanana3679@gmail.com");
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}

const verifyCode = async () => {
  console.log("verifyCode");
  try {
    const response = await axios.post(LOCALHOST + "auth/verify-code?email=nanana3679@gmail.com&code=081646");
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}

// // 콘솔에서 테스트하는 명령어 
// // adb shell am start -W -a android.intent.action.VIEW -d "facefriend://redirect?code=12345"
const useDeepLinkCode = () => {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleDeepLink = (event: { url: string }) => {
    const url = new URL(event.url);
    console.log(extractCodeFromUrl(url));
  };
};

const extractCodeFromUrl = (url: URL): string | null => {
  try {
    const code = url.searchParams.get('code');
    return code;
  } catch (error) {
    console.error("Invalid URL", error);
    return null;
  }
};

const App = () => {
  useDeepLinkCode();
  // getLoginPage();
  // linkLoginPage("https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=bce7-115-138-61-136.ngrok-free.app&response_type=code&scope=email profile");
  // googleLogin();
  // email();
  // sendCode();
  // verifyCode();
  console.log(Config.LOCALHOST);

  return (
    <GoogleLogin/>
    // <></>
  );
}

export default App;
