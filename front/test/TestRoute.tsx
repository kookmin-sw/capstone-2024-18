import { Routes, Route,  NativeRouter } from "react-router-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Test1 from './pages/Test1.tsx';
import Test2 from './pages/Test2.tsx';
import Test3 from './pages/Test3.tsx';


// import TestRoute from './test/TestRoute.tsx';

// function App() {
//   return (
//     <TestRoute/>
//   )
// }

// export default App;

// route 기능 확인해보고 싶으면, App.tsx에 위 코드 그대로 붙여넣기
function TestRoute() {
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

export default TestRoute;
