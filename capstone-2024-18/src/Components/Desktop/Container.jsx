import classes from './DesktopPage.module.css';

function Container({height}) {
  const { innerWidth: width } = window;

  return (
    <div style={{flexDirection: 'column', display: 'flex', height: height}}>
      <img src={require('../../images/halfCircle.png')} width={width} height={width} style={{margin: 0, position: 'unset'}}/>
      <div style={{backgroundColor: '#FFECEB', flex: 1}}/>
    </div>
  );
}

export default Container;
