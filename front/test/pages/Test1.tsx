import { useContext } from 'react';
import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from "react-native";
import SubTest1 from './SubTest1.tsx';
import SubTest2 from './SubTest2.tsx';
import eye from '../../assets/images/eye.png';
import CustomButton from "../../components/CustomButton.tsx";
import { AuthContext } from '../../store/auth-context.tsx';
import { useNavigate } from "react-router-native";
import { isValidResponse, putBasicInfo } from '../../util/auth.tsx';
import { createAlertMessage } from '../../util/alert.tsx';


const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await authCtx.signout();
    navigate("/login");
  }

  return (
    <View style={{height: "100%"}}>
    <NavigationContainer>
      <CustomButton onPress={handleLogout}>로그아웃</CustomButton>
      <PaperProvider theme={{version: 2}}>
        <Tab.Navigator 
          shifting={true}
          initialRouteName='sub1' 
          activeColor="#ffffff"
          screenOptions={{tabBarColor: 'black'}}>
          <Tab.Screen 
            name="sub1" component={SubTest1} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={eye}/>,
              tabBarLabel: 'No.1',
            }}/>
          <Tab.Screen 
            name="sub2" component={SubTest2} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={eye}/>,
              tabBarLabel: 'No.2',
            }}/>
          <Tab.Screen 
            name="sub3" component={SubTest2} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={eye}/>,
              tabBarLabel: 'No.3',
            }}/>
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
    </View>
  );
};

export default Test1;