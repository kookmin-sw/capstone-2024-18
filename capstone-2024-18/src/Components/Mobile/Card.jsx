import classes from './Card.module.css';

const Card = (props) => {
  return (
    <div className={classes["card-container"]}>
      {props.title && <div className={classes["card-title"]}>
        <p className={classes["card-title-text"]}>{props.title}</p>
      </div>}
      <div className={classes.card}>
        <p className={classes["section-text"]}>{props.children}</p>
      </div>
    </div>
  )
}

export default Card;