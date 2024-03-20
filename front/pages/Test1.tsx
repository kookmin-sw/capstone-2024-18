import { useState } from 'react';
import SubTest1 from './SubTest1';
import SubTest2 from './SubTest2';
import { BottomNavigation, Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  const [ state, setState ] = useState({
    index: 0,
    routes: [
      { key: 'sub1', title: 'sub page1', icon: 'history', color: '#FFB8B3'},
      { key: 'sub2', title: 'sub page2', icon: 'album', color: '#FFB8B3'},
    ],
  });

  const _handleIndexChange = (index: number) => {
    setState({...state, "index": index });
  };

  const _renderScene = BottomNavigation.SceneMap({
    sub1: SubTest1,
    sub2: SubTest2,
  });
  const _renderIcon = ({route}: any) => {
    switch (route.key) {
      case 'sub1':
      case 'sub2':
        return <Icon size={30} color={route.color} source={require('../assets/images/eye.png')}/>;
    }
  }

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