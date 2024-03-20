import SubTest1 from './SubTest1';
import SubTest2 from './SubTest2';
import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  return (
    <NavigationContainer>
      <PaperProvider theme={{version: 2}}>
        <Tab.Navigator 
          shifting={true}
          initialRouteName='sub1' 
          activeColor="#ffffff" // 선택한 항목의 색깔
          style={{borderTopLeftRadius: 20}} >
          <Tab.Screen 
            name="sub1" component={SubTest1} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={require('../assets/images/eye.png')}/>,
              tabBarLabel: 'No.1',
              tabBarColor:'black',
            }}/>
          <Tab.Screen 
            name="sub2" component={SubTest2} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={require('../assets/images/eye.png')}/>,
              tabBarLabel: 'No.2',
              tabBarColor:'#694fad'
            }}/>
          <Tab.Screen 
            name="sub3" component={SubTest2} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={require('../assets/images/eye.png')}/>,
              tabBarLabel: 'No.3',
              tabBarColor:'#FF7269'
            }}/>
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default Test1;