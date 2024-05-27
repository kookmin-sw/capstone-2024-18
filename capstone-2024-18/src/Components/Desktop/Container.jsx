import classes from './DesktopPage.module.css';

function Container() {
  return (
    <div style={{flexDirection: 'column', display: 'flex'}}>
      <img src={require('../../images/halfCircle.png')} width={'100%'} height={'auto'} style={{margin: 0, flex: 1, position: 'unset'}}/>
      <div style={{backgroundColor: '#FFECEB', height: '500px'}}/>
    </div>
  );
}

export default Container;
