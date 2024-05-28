import useMediaQuery from "./Hooks/useMediaQuery";

import DesktopPage from "./Pages/DesktopPage";
import MobilePage from "./Pages/MobilePage";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="App">{isMobile ? <MobilePage /> : <DesktopPage />}</div>
  );
}

export default App;
