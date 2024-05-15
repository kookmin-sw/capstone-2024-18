import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native"
import AutoHeightImage from 'react-native-auto-height-image';

import { AuthContext } from '../store/auth-context.tsx';
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../store/user-context.tsx";

const Home = ({ navigation }: any) => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const [reloadCounter, setReloadCounter] = useState(0);

  const reload = () => {
    setReloadCounter(reloadCounter + 1);
  }
  
  useFocusEffect(
    useCallback(() => {
      if (!authCtx.status) return;
      if (authCtx.status === 'LOADED') return
      if (authCtx.status === 'NOT_EXIST') {
        navigation.navigate('Login');
      }
    }, [authCtx.status])
  );

  useFocusEffect(
    useCallback(() => {
      if (userCtx.status === 'BASIC_INFO_NOT_EXIST') {
        navigation.navigate('BasicInfo');
      }
      if (userCtx.status === 'FACE_INFO_NOT_EXIST') {
        navigation.navigate('FaceInfo');
      }
      if (userCtx.status === 'FACE_FEATURE_NOT_EXIST') {
        navigation.navigate('AnalysisInfo');
      }
      if (userCtx.status === 'FACE_FEATURE_EXIST') {
        navigation.navigate('Main');
      }
    }, [userCtx.status])
  );
  
  useEffect(() => {
    console.log(userCtx.status)
  }, [userCtx.status])

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