import classes from "./Profile.module.css";

const Profile = (props) => {
  return (
    <div className={classes.container}>
      <img className={classes.image} src={props.src} alt={props.alt}/>
      <div className={classes["text-container"]}>{props.children}</div>
    </div>
  )
}
export default Profile;