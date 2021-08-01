import classes from './Loader.module.scss'

const Loader = ({ show }) => {
  return show ? <div className={classes.loader}></div> : null
}

export default Loader
