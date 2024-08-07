import classes from './DesktopPage.module.css';

function Header() {
  return (
    <div id={classes.header}>
      <div style={{flexDirection: "row", display: 'flex'}}>
        <p id={classes.title}> capstone-2024-18 </p>
        <div style={{flex: 1}}></div>
        <a id={classes.githubBtn} href="https://github.com/kookmin-sw/capstone-2024-18" style={{textDecoration: 'none'}}>
          <text style={{color: "#FF7269", margin: 0, fontWeight:"bold", fontSize: "20px", lineHeight: "20px", paddingRight: 5}}>Visit Github</text>
          <svg width="20px" height="20px" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="66" cy="65" r="60" fill="white"/>
            <path d="M125 65C125 98.1373 98.2563 125 65.2656 125C32.2753 125 5.53125 98.1373 5.53125 65C5.53125 31.8629 32.2753 5 65.2656 5C98.2563 5 125 31.8629 125 65Z" stroke="#FF7871" stroke-width="10"/>
            <path d="M76.6599 44.2115C69.1672 42.13 61.3606 42.13 53.8679 44.2115C53.7398 44.247 53.6117 44.2833 53.4843 44.3202C52.6978 44.5476 51.8517 44.393 51.1978 43.8991C43.3155 37.9459 39.1983 38.2118 38.1795 38.4104C38.0157 38.4424 37.8913 38.5651 37.8347 38.7226C37.8203 38.7624 37.8062 38.8022 37.792 38.8421C36.1692 43.4334 35.9213 48.5206 37.0744 53.283C37.1415 53.5604 37.2133 53.8364 37.2899 54.111C37.295 54.129 37.3 54.147 37.3051 54.165C37.3715 54.401 37.3228 54.655 37.1741 54.8504C37.0609 54.9984 36.9494 55.1484 36.8397 55.2997C33.7028 59.6257 32.0056 65.1417 32.0805 70.831C32.0805 93.9324 44.0513 99.2384 55.5404 100.807L55.7781 100.838C62.1756 101.799 68.3083 101.74 74.6853 100.652L74.8466 100.633C86.3913 99.2257 98.447 94.0577 98.447 70.831C98.522 65.1417 96.8249 59.6257 93.6881 55.2997C93.5873 55.161 93.485 55.023 93.3815 54.8864L93.3735 54.8764C93.2129 54.665 93.1598 54.3897 93.2315 54.1337C93.3105 53.851 93.3842 53.5677 93.4525 53.283C94.6067 48.5071 94.3446 43.4048 92.6946 38.8114C92.6839 38.7832 92.674 38.7551 92.664 38.727C92.6056 38.5666 92.4788 38.4416 92.3116 38.4092C91.2881 38.2106 87.1937 37.9584 79.33 43.8991C78.6762 44.3928 77.83 44.5462 77.0435 44.32C76.9161 44.2832 76.788 44.247 76.6599 44.2115Z" stroke="#FF7871" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
      <p id={classes.subtitle}> 관상 기반 데이팅 앱, FaceFriend </p>
    </div>
  );
}

export default Header;
