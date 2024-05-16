import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View } from "react-native";
import SelfProduce from "./SelfProduce.tsx";
import Friends from "./Friends.tsx";
import Profile from "./Profile.tsx";
import CustomBackHandler from "../components/CustomBackHandler.tsx";
import ChatRoomList from "../components/chat/ChatRoomList.tsx";

const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  return (
    <View style={{height: "100%"}}>
      <CustomBackHandler haveExit={true}/>
      <PaperProvider theme={{version: 2}}>
        <Tab.Navigator 
          shifting={true}
          initialRouteName='sub1' 
          activeColor='#626262'
          screenOptions={{tabBarColor: '#D9D9D9'}}>
          <Tab.Screen 
            name="sub1" component={Friends} 
            options={{
              tabBarIcon: () => <Icon source={"home"} size={20} color={'#626262'} />,
              tabBarLabel: 'Friends',
            }}/>
          <Tab.Screen 
            name="sub2" component={SelfProduce}
            options={{
              tabBarIcon: () => <Icon source={"file"} size={20} color={'#626262'} />,
              tabBarLabel: '자기소개서',
            }}/>
          <Tab.Screen 
            name="sub3" component={Profile}
            options={{
              tabBarIcon: () => <Icon source={"camera"} size={20} color={'#626262'} />,
              tabBarLabel: 'Profile',
            }}/>
          <Tab.Screen 
            name="sub4" component={ChatRoomList}
            options={{
              tabBarIcon: () => <Icon source={"chat"} size={20} color={'#626262'} />,
              tabBarLabel: 'Chat',
            }}/>
        </Tab.Navigator>
      </PaperProvider>
    </View>
  );
};

export default Test1;