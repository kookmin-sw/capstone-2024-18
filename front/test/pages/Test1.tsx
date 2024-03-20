import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SubTest1 from './SubTest1.tsx';
import SubTest2 from './SubTest2.tsx';
import eye from '../../assets/images/eye.png';


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
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={eye}/>,
              tabBarLabel: 'No.1',
              tabBarColor:'black',
            }}/>
          <Tab.Screen 
            name="sub2" component={SubTest2} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={eye}/>,
              tabBarLabel: 'No.2',
              tabBarColor:'#694fad'
            }}/>
          <Tab.Screen 
            name="sub3" component={SubTest2} 
            options={{
              tabBarIcon: ({color}) => <Icon size={25} color={color} source={eye}/>,
              tabBarLabel: 'No.3',
              tabBarColor:'#FF7269'
            }}/>
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default Test1;