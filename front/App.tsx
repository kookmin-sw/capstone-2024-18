import AuthContextProvider from './store/auth-context';
import Signup from './pages/Signup';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './assets/colors';

function App() {

  return (
    <AuthContextProvider>
      <SafeAreaProvider style={{ backgroundColor: colors.white }}>
        <Signup/>
      </SafeAreaProvider>
    </AuthContextProvider>
  );
}

export default App;