import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={classes.container}>
      <img className={classes.logo} src={`${process.env.PUBLIC_URL}/facefriend-logo.png`} alt="FaceFriend Logo"/>
      <p className={classes.text}>Copyright @ 2024 국민대학교 캡스톤 18팀</p>
    </div>
  )
}

export default Footer;