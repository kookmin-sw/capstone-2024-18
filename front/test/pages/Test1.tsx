import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View } from "react-native";
import SubTest1 from './SubTest1.tsx';
import SubTest2 from './SubTest2.tsx';
import eye from '../../assets/images/eye.png';


const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  return (
    <View style={{height: "100%"}}>
    <NavigationContainer>
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