import { useCallback, useContext } from "react";
import { View } from "react-native"
import AutoHeightImage from 'react-native-auto-height-image';

import { AuthContext } from '../store/auth-context.tsx';
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../store/user-context.tsx";
import { ChatRoomContext } from "../store/chat-room-context.tsx";

const Home = ({ navigation }: any) => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const chatRoomCtx = useContext(ChatRoomContext);

  useFocusEffect(
    useCallback(() => {
      console.log("authCtx.status:", authCtx.status)
      if (!authCtx.status) return;
      if (authCtx.status === 'LOADED') return
      if (authCtx.status === 'NOT_EXIST') {
        navigation.navigate('Login');
      }
    }, [authCtx.status, navigation])
  );

  useFocusEffect(
    useCallback(() => {
      console.log("userCtx.status:", userCtx.status, chatRoomCtx.status)
      if (userCtx.status === 'BASIC_INFO_NOT_EXIST') {
        navigation.navigate('BasicInfo');
      }
      if (userCtx.status === 'FACE_INFO_NOT_EXIST') {
        navigation.navigate('FaceInfo');
      }
      if (userCtx.status === 'FACE_FEATURE_NOT_EXIST') {
        navigation.navigate('FaceFeature');
      }
      if (chatRoomCtx.status === 'CONNECTED' && (userCtx.status === 'RESUME_EXIST' || userCtx.status === 'RESUME_NOT_EXIST' || userCtx.status === 'RESUME_ERROR')) {
        navigation.navigate('Main');
      }
      
    }, [userCtx.status, chatRoomCtx.status, navigation])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AutoHeightImage
        width={200}
        style={{alignSelf:"center", marginHorizontal: 80}}
        source={require('../assets/images/logo.png')}
      />
    </View>
  )
}

export default Home;