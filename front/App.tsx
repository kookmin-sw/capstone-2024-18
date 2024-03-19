import { Routes, Route,  NativeRouter } from "react-router-native";
import Test1 from './pages/Test1.tsx';
import Test2 from './pages/Test2.tsx';
import Test3 from './pages/Test3.tsx';

function App() {
  return (
    <NativeRouter>
      <Routes>
        <Route path={"/test1"} element={<Test1/>}/>
        <Route path={"/test2"} element={<Test2/>}/>
        <Route path={"/test3"} element={<Test3/>}/>
      </Routes>
    </NativeRouter>
  );
}

export default App;
