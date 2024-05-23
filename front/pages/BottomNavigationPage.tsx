import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { KeyboardAvoidingView, View } from "react-native";
import SelfProduce from "./SelfProduce.tsx";
import Friends from "./Friends.tsx";
import Profile from "./Profile.tsx";
import CustomBackHandler from "../components/CustomBackHandler.tsx";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../store/user-context.tsx";
import ChatRoomList from "../components/chat/ChatRoomList.tsx";
import { deleteMyResume } from "../util/auth.tsx";
import { AuthContext } from "../store/auth-context.tsx";
import { colors } from "../assets/colors.tsx";
import { useFocusEffect } from "@react-navigation/native";
import { AlertContext } from "../store/alert-context.tsx";


const Tab = createMaterialBottomTabNavigator();

const Test1 = ({navigation}: any) => {
  const [previousRoute, setPreviousRoute] = useState('');

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { createAlertMessage } = useContext(AlertContext);

  const selfUrl = userCtx.faceinfo.generatedS3url;

  useFocusEffect(
    useCallback(() => {
      console.log("authCtx.status:", authCtx.status)
      if (authCtx.status === 'LOGGED_OUT') {
        console.log('here')
        navigation.navigate('Login');
      }
    }, [authCtx.status, navigation])
  )

  return (
    <View style={{height: "100%"}}>
      <CustomBackHandler haveExit={true}/>
      <PaperProvider theme={{version: 2}}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
      >
        <Tab.Navigator 
          shifting={true}
          initialRouteName='sub1' 
          activeColor={colors.point}
          screenOptions={{
            tabBarColor: colors.white,
          }}
          barStyle={{borderTopWidth: 1.5, borderTopColor: '#FFECEB', height: 80}}
          screenListeners={({route, navigation}) => {
            return ({
              tabPress: e => {
                if (previousRoute === "sub2") {
                  if (route.name !== "sub2") {
                    // 이전 페이지가 sub2인 경우에만 전환을 멈추기

                    if (userCtx.status === 'RESUME_EDIT') {
                      e.preventDefault();
                      
                      createAlertMessage("자기소개서 저장을 하지 않으실 경우, 수정사항이 삭제될 수 있습니다. \n그래도 다른 화면으로 이동하시겠습니까?", () => {
                        navigation.navigate(route.name);
                        userCtx.setStatus('RESUME_EXIST')
                        setPreviousRoute(route.name);
                      })

                      
                    } else if (userCtx.status === 'RESUME_CREATE') {
                      e.preventDefault();

                      createAlertMessage("자기소개서 저장을 하지 않으실 경우, 수정사항이 삭제될 수 있습니다. \n그래도 다른 화면으로 이동하시겠습니까?", () => {
                        if (authCtx.accessToken) {
                          userCtx.setResumeinfo(undefined);
                          deleteMyResume(authCtx.accessToken);
                        }
                        navigation.navigate(route.name);
                        setPreviousRoute(route.name);
                      })

                    }
                  }
                } else {
                  setPreviousRoute(route.name);
                }
              },
            });
          }}
          >
          <Tab.Screen 
            name="sub1" component={Friends} 
            options={{
              tabBarIcon: () => <Icon source={"home"} size={25} color={'#FFB8B3'}/>,
              tabBarLabel: 'Friends',
            }}/>
          <Tab.Screen 
            name="sub4" component={ChatRoomList}
            options={{
              tabBarIcon: () => <Icon source={"chat"} size={25} color={'#FFB8B3'} />,
              tabBarLabel: 'Chat',
            }}/>
          <Tab.Screen 
            name="sub2" component={SelfProduce}
            options={{
              tabBarIcon: () => <Icon source={"file"} size={25} color={'#FFB8B3'} />,
              tabBarLabel: 'Produce',
            }}
            />
          <Tab.Screen 
            name="sub3" component={Profile}
            options={{
              tabBarIcon: () => <View style={{borderRadius: 25, overflow: 'hidden'}}><Icon source={{uri: selfUrl}} size={25}/></View>,
              tabBarLabel: 'Profile',
            }}/>
        </Tab.Navigator>
        </KeyboardAvoidingView>
      </PaperProvider>
    </View>
  );
};

export default Test1;