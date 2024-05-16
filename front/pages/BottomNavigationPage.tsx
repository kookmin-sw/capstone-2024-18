import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Alert, View } from "react-native";
import SelfProduce from "./SelfProduce.tsx";
import Friends from "./Friends.tsx";
import Profile from "./Profile.tsx";
import CustomBackHandler from "../components/CustomBackHandler.tsx";
import { useContext, useState } from "react";
import { UserContext } from "../store/user-context.tsx";
import { deleteMyResume } from "../util/auth.tsx";
import { AuthContext } from "../store/auth-context.tsx";


const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  const [previousRoute, setPreviousRoute] = useState('');
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  return (
    <View style={{height: "100%"}}>
      <CustomBackHandler haveExit={true}/>
      <PaperProvider theme={{version: 2}}>
        <Tab.Navigator 
          shifting={true}
          initialRouteName='sub1' 
          activeColor='#626262'
          screenOptions={{
            tabBarColor: '#D9D9D9',
          }}
          screenListeners={({route, navigation}) => {
            return ({
              tabPress: e => {
                if (previousRoute === "sub2") {
                  if (route.name !== "sub2") {
                    // 이전 페이지가 sub2인 경우에만 전환을 멈추기

                    if (userCtx.status === 'RESUME_EDIT') {
                      e.preventDefault();
                      Alert.alert("경고", "자기소개서 저장을 하지 않으실 경우, 수정사항이 삭제될 수 있습니다. \n그래도 다른 탭으로 이동하시겠습니가?", [
                        {
                          text: "확인", onPress: () => {
                            navigation.navigate(route.name);
                            setPreviousRoute(route.name);
                          }
                        },
                        {
                          text: "취소",
                          onPress: () => null,
                          style: "cancel"
                      },
                      ]);
                    } else if (userCtx.status === 'RESUME_CREATE') {
                      e.preventDefault();
                      Alert.alert("경고", "자기소개서 저장을 하지 않으실 경우, 수정사항이 삭제될 수 있습니다. \n그래도 다른 탭으로 이동하시겠습니가?", [
                        {
                          text: "확인", onPress: () => {
                            if (authCtx.accessToken) {
                              userCtx.setResumeinfo(undefined);
                              deleteMyResume(authCtx.accessToken);
                            }
                            navigation.navigate(route.name);
                            setPreviousRoute(route.name);
                          }
                        },
                        {
                          text: "취소",
                          onPress: () => null,
                          style: "cancel"
                      },
                      ]);
                    }
                  }
                } else {
                  console.log("다른 페이지로 전환합니다.");
                  setPreviousRoute(route.name);
                }
              },
            });
          }}
          >
          <Tab.Screen 
            name="sub1" component={Friends} 
            options={{
              tabBarIcon: () => <Icon source={"home"} size={25} color={'#626262'} />,
              tabBarLabel: 'Friends',
            }}/>
          <Tab.Screen 
            name="sub2" component={SelfProduce}
            options={{
              tabBarIcon: () => <Icon source={"file"} size={25} color={'#626262'} />,
              tabBarLabel: '자기소개서',
            }}
            />
          <Tab.Screen 
            name="sub3" component={Profile}
            options={{
              tabBarIcon: () => <Icon source={'account'} size={25} color={'#626262'} />,
              tabBarLabel: 'Profile',
            }}/>
        </Tab.Navigator>
      </PaperProvider>
    </View>
  );
};

export default Test1;