import { Routes, Route,  NativeRouter } from "react-router-native";
import Test1 from './pages/Test1.tsx';
import Test2 from './pages/Test2.tsx';
import Test3 from './pages/Test3.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';


function App() {
  return (
    <SafeAreaProvider>
      <NativeRouter>
        <Routes>
          <Route path={"/"} element={<Test1/>}/>
          <Route path={"/test2"} element={<Test2/>}/>
          <Route path={"/test3"} element={<Test3/>}/>
        </Routes>
      </NativeRouter>
    </SafeAreaProvider>
  );
}

export default App;
