import classes from "./Intro.module.css";

const Intro = () => {
  return (
    <div className={classes.innerContainer}>
      <img className={classes.logo} src={`${process.env.PUBLIC_URL}/facefriend-logo.png`} alt="GitHub Logo"/>
      <p className={classes.intro}>
        <span className='bold' style={{ fontSize: "1.75rem" }}>인간관계를 맺는 색다른 즐거움, <span className='primary'>FACE FRIEND</span></span><br/>
        <a href='https://drive.google.com/file/d/1VuFRnFYh9nLRFrohUMbWwr6bjLkoaPlZ/view?usp=sharing'>
          <span className='underline'>Android APK 파일 다운로드 링크 😎</span>
        </a>
      </p>
    </div>
  )
}

export default Intro;