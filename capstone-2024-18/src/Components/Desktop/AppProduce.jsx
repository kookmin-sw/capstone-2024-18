import React from 'react';

function AppProduce() {
  return (
    <div style={{backgroundColor: '#fff', textAlign: 'center', padding: 20}}>
      <img src={require('../../images/logo.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
      <div style={{width: '100%', marginTop: 20, marginBottom: 5}}>
          <text>인간관계를 맺는 색다른 즐거움, </text>
          <text style={{color: '#FF7871'}}>FaceFrined</text>
      </div>
      <a href='https://drive.google.com/file/d/1kkJTefS8EY83Nda040PhReRYd5413jDo/view?usp=drive_link'>
          Android APK 파일 다운로드 링크 😎
      </a>
    </div>
  );
}

export default AppProduce;
