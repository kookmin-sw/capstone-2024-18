import classes from './Button.module.css';

const Button = (props) => {
  return (
    <div className={classes.container}>
      {props.children}
    </div>
  )
}

export default Button;