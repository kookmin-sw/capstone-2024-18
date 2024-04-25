import { Icon, PaperProvider } from "react-native-paper";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View } from "react-native";
import SubTest1 from '../test/pages/SubTest1.tsx';
import SelfProduce from "./SelfProduce.tsx";


const Tab = createMaterialBottomTabNavigator();

const Test1 = () => {
  return (
    <View style={{height: "100%"}}>
      <PaperProvider theme={{version: 2}}>
        <Tab.Navigator 
          shifting={true}
          initialRouteName='sub1' 
          activeColor="#ffffff"
          screenOptions={{tabBarColor: 'black'}}>
          <Tab.Screen 
            name="sub1" component={SubTest1} 
            options={{
              tabBarIcon: ({color}) => <Icon source={"camera"} size={20} color={color} />,
              tabBarLabel: 'No.1',
            }}/>
          <Tab.Screen 
            name="sub2" component={SelfProduce} 
            options={{
              tabBarIcon: ({color}) => <Icon source={"file"} size={20} color={color} />,
              tabBarLabel: '자기소개서',
            }}/>
        </Tab.Navigator>
      </PaperProvider>
    </View>
  );
};

export default Test1;