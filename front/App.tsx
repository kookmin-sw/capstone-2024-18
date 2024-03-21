import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Login from './pages/Login.tsx';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Login />
      </SafeAreaView>
    </SafeAreaProvider>  
  );
}

export default App;
