import React from 'react';
import classes from './DesktopPage.module.css';

function AppProduce() {
  return (
    <div style={{backgroundColor: '#fff', textAlign: 'center', padding: 20}}>
      <img src={`${process.env.PUBLIC_URL}/facefriend-logo.png`} width={"20%"} style={{position: 'relative', margin: 0}}/>
      <div style={{width: '100%', marginTop: 20, marginBottom: 5}}>
          <text id={classes.contentTitle}>인간관계를 맺는 색다른 즐거움, </text>
          <text id={classes.contentTitle} style={{color: '#FF7871'}}>FaceFrined</text>
      </div>
      <a id={classes.contentSubTitle} style={{textDecoration: 'none'}} href='https://drive.google.com/file/d/1VuFRnFYh9nLRFrohUMbWwr6bjLkoaPlZ/view?usp=drive_link'>
          Android APK 파일 다운로드 링크 😎
      </a>
    </div>
  );
}

export default AppProduce;
