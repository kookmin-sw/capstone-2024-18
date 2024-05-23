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
import OtherUserSelfProduce from './pages/OtherUserSelfProduce.tsx';
import ChatContextProvider from './store/chat-context.tsx';
import ChatRoomContextProvider from './store/chat-room-context.tsx';
import UserContextProvider from './store/user-context.tsx';
import TotalRecommend from './pages/TotalRecommend.tsx';
import Banner1 from './pages/banner/Banner1.tsx';
import Banner2 from './pages/banner/Banner2.tsx';
import Banner3 from './pages/banner/Banner3.tsx';
import CustomAlert from './components/CustomAlert.tsx';
import { useContext } from 'react';
import AlertContextProvider, { AlertContext } from './store/alert-context.tsx';

function AlertHandler() {
  const { alert } = useContext(AlertContext);
  return <CustomAlert isVisible={alert.isVisible} message={alert.message} onClose={alert.onClose} onConfirm={alert.onConfirm} />;
}

const Stack = createStackNavigator();
function App() {
  return (
    <AlertContextProvider>
      <AuthContextProvider>
        <ChatContextProvider>
          <ChatRoomContextProvider>
            <UserContextProvider>
              <SafeAreaProvider>
                <AlertHandler />
                <NavigationContainer>
                  <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="FindEmail" component={FindEmail}/>
                    <Stack.Screen name="FindPw" component={FindPw}/>
                    <Stack.Screen name="Signup" component={Signup}/>
                    <Stack.Screen name='Main' component={BottomNavigationPage}/>
                    <Stack.Screen name='Home' component={Home}/>
                    <Stack.Screen name='Banner1' component={Banner1}/>
                    <Stack.Screen name='Banner2' component={Banner2}/>
                    <Stack.Screen name='Banner3' component={Banner3}/>
                    <Stack.Screen name='BasicInfo' component={BasicInfoPage}/>
                    <Stack.Screen name='FaceInfo' component={FaceInfoPage}/>
                    <Stack.Screen name='FaceFeature' component={FaceFeaturePage}/>
                    <Stack.Screen name='Nickname' component={NicknamePage}/>
                    <Stack.Screen name='BasicInfoWithoutNickname' component={BasicInfoWithoutNickname}/>
                    <Stack.Screen name='OtherSelfProduce' component={OtherUserSelfProduce}/>
                    <Stack.Screen name='TotalRecommend' component={TotalRecommend}/>
                    {/* Bottom Navigation이 있는 페이지의 경우 SafeAreaView를 이용하면 ios에서 bottomNavigation이 제대로 안 보임 */}
                  </Stack.Navigator>
                </NavigationContainer>
              </SafeAreaProvider>  
            </UserContextProvider>
          </ChatRoomContextProvider>
        </ChatContextProvider> 
      </AuthContextProvider>
    </AlertContextProvider>
  );
}

export default App;
