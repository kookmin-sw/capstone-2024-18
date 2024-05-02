import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthContextProvider from './store/auth-context';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import BottomNavigationPage from './pages/BottomNavigationPage.tsx';
import Home from './pages/Home.tsx';
import BasicInfoPage from './pages/BasicInfoPage.tsx';
import FaceInfoPage from './pages/FaceInfoPage.tsx';
import FaceFeaturePage from './pages/FaceFeaturePage.tsx';
import FindEmail from './pages/FindEmail.tsx';
import FindPw from './pages/FindPw.tsx';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NicknamePage from './pages/NicknamePage.tsx';
import BasicInfoWithoutNickname from './pages/BasicInfoWithoutNickname.tsx';

const Stack = createStackNavigator();
function App() {
  return (
    <AuthContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="FindEmail" component={FindEmail}/>
            <Stack.Screen name="FindPw" component={FindPw}/>
            <Stack.Screen name="Signup" component={Signup}/>
            <Stack.Screen name='Main' component={BottomNavigationPage}/>
            <Stack.Screen name='Home' component={Home}/>
            <Stack.Screen name='BasicInfo' component={BasicInfoPage}/>
            <Stack.Screen name='FaceInfo' component={FaceInfoPage}/>
            <Stack.Screen name='AnalysisInfo' component={FaceFeaturePage}/>
            <Stack.Screen name='Nickname' component={NicknamePage}/>
            <Stack.Screen name='BasicInfoWithoutNickname' component={BasicInfoWithoutNickname}/>
            {/* Bottom Navigation이 있는 페이지의 경우 SafeAreaView를 이용하면 ios에서 bottomNavigation이 제대로 안 보임 */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>  
    </AuthContextProvider>
  );
}

export default App;
