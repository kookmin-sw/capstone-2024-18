import Header from "../Components/Desktop/Header.jsx"
import Contents from "../Components/Desktop/Contents.jsx"
import Container from "../Components/Desktop/Container.jsx";
import AppProduce from "../Components/Desktop/AppProduce.jsx";
import { useEffect, useRef, useState } from "react";

const DesktopPage = () => {
  const backgroundRef = useRef(null);
  const [height, setHeight] = useState();

  useEffect(() => {
    if (backgroundRef.current) {
      setHeight(backgroundRef.current.offsetHeight);
      console.log(backgroundRef.current.offsetHeight);
    }
  }, [])

  return (
    <>
      <Header/>
      <AppProduce/>
      <div style={{position: 'relative', height: height, display: 'flex'}}>
        <div ref={backgroundRef} style={{position: 'absolute', width: '100%'}}> 
          <Contents/>
        </div>
        <Container/>
      </div>
      <div style={{textAlign: 'center', padding: 20, backgroundColor: '#FF7871'}}>
        <img src={require('../images/logo.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
        <text style={{display: 'block', textAlign: 'right'}}>Copyright @ 2024 국민대학교 캡스톤 18팀</text>
      </div>
    </>
  );
}

export default DesktopPage;