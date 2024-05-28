import classes from './Header.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
      <div>
        <h1 className={classes.h1}>capstone-2024-18</h1>
        <h2 className={classes.h2}>관상 기반 데이팅 앱, FaceFriend</h2>
      </div>
      <a href='https://github.com/kookmin-sw/capstone-2024-18'>
        <img className={classes.logo} src={`${process.env.PUBLIC_URL}/github-logo.png`} alt="GitHub Logo"/>
      </a>
    </header>
  );
}

export default Header;
