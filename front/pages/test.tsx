import React, {useEffect} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';



// 77:AD:95:F9:D2:68:C6:A9:9A:88:EA:A8:94:07:53:A9:5D:05:4D:4F


const GoogleLogin: React.FC = () => {
  // Google SignIn 구성
const googleSigninConfigure = () => GoogleSignin.configure({
  // webClientId: '256579802647-p9jbn251b364onlpt0qohqjpfot5lcse.apps.googleusercontent.com',
  webClientId: '256579802647-rtreopphjtg42kk1bliqgr0ba98c5utl.apps.googleusercontent.com',
  scopes: ['profile'], // what API you want to access on behalf of the user, default is email and profile
  // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
  useEffect(() => {
    googleSigninConfigure();
  }, [])

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
      <GoogleSigninButton onPress={signIn} />
  )
};

export default GoogleLogin;