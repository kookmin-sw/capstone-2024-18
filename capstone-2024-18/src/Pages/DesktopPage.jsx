import Header from "../Components/Desktop/Header.jsx"
import Contents from "../Components/Desktop/Contents.jsx"
import Container from "../Components/Desktop/Container.jsx";
import AppProduce from "../Components/Desktop/AppProduce.jsx";

const DesktopPage = () => {
  return (
    <>
      <Header/>
      <AppProduce/>
      <div style={{position: 'relative', flex: 1}}>
        <div style={{position: 'absolute', width: '100%'}}> 
          <Contents/>
        </div>
        <Container/>
      </div>
    </>
  );
}

export default DesktopPage;