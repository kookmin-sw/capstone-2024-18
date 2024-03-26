import React, { useState } from 'react';
import { View, Button, ScrollView, Linking } from 'react-native';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface CityData {
  [key: string]: string[];
}


GoogleSignin.configure({
  webClientId: '256579802647-rtreopphjtg42kk1bliqgr0ba98c5utl.apps.googleusercontent.com',
  // 다른 옵션들 필요시 여기에 추가
});

const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    // userInfo를 사용하여 로그인 성공 처리
    console.log(userInfo);
  } catch (error) {
    // 로그인 실패 처리
  }
};

const cityData: CityData = {
  서울: ['강남구', '서초구', '중구', '은평구'],
  인천: ['중구', '남동구', '부평구', '계양구'],
};

const login = async () => {
  try {
    const endpoint = "http://10.0.2.2:8080/oauth/google/login-uri?redirect-uri=http://10.0.2.2:8080/index.html";
    const response = await axios.get(endpoint);
    const loginUri = response.data.loginUri;
    console.log(loginUri);
    // const uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=http://localhost:8080/index.html&response_type=code&scope=email profile";

    const uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id=256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com&redirect_uri=myapp://redirect&response_type=code&scope=email profile";

    // myapp://redirect
    Linking.openURL(uri).catch(err => console.error('Error opening URI:', err));

    
  } catch (e) {
    console.log(e);
  }
}

const post = async () => {
  const code = "4%2F0AeaYSHD6JpWPZSBWnjp73emkBiFmkWNa0vClrosJY0qG9uIJZEt9Askj6V5Vu6dAJJAAtQ";
  const redirectUri = "http://localhost:8080/index.html";
  const postUrl = "http://localhost:8080/oauth/google/login";
  
  const postData = {
    redirectUri: redirectUri,
    code: code,
  };

  try {
    const response = await axios.post(postUrl, postData);
    console.log(response.data); 
  } catch (error: any) {
    console.error("Error during OAuth login:", error.response ? error.response.data : error.message);
  }
}

const TestPage = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  post();

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <ScrollView style={{ marginTop: 20 }}>
        {selectedCity &&
          <>
          {cityData[selectedCity].map((district: string) => (
            <View key={district} style={{ marginVertical: 5, marginHorizontal: 10 }}>
              <Button title={district} onPress={() => console.log(`${selectedCity}의 ${district} 선택됨`)} />
            </View>
          ))}
          <View key="cancel" style={{ marginVertical: 5, marginHorizontal: 10 }}>
              <Button title="취소" onPress={() => setSelectedCity(null)} />
            </View>
          </>
          }
        {!selectedCity &&
          Object.keys(cityData).map((city) => (
            <View key={city} style={{ marginVertical: 5, marginHorizontal: 10 }}>
              <Button title={city} onPress={() => setSelectedCity(city)} />
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default TestPage;
