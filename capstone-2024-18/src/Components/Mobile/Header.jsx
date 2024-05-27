import classes from './Header.module.css';

const Header = () => {
  return (
    <header>
      <h1>capstone-2024-18</h1>
      <h2>관상 기반 데이팅 앱, FaceFriend</h2>
      <img src={`${process.env.PUBLIC_URL}/Mobile/github-logo.svg`} alt="GitHub Logo" width="80" height="80" />
    </header>
  );
}

export default Header;
