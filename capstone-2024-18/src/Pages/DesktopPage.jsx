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
    }
  }, [])

  return (
    <>
      <Header/>
      <AppProduce/>
      <div style={{position: 'relative', height: height}}>
        <div ref={backgroundRef} style={{position: 'absolute', width: '100%'}}> 
          <Contents/>
        </div>
        <Container height={height}/>
      </div>
    </>
  );
}

export default DesktopPage;