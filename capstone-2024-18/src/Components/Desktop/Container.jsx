import classes from './DesktopPage.module.css';

function Container() {
  const { innerWidth: width } = window;

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <img src={`${process.env.PUBLIC_URL}/halfCircle.png`} width={width} height={width} style={{margin: 0, position: 'unset', backgroundColor: '#fff'}}/>
      <div style={{backgroundColor: '#FFECEB', width: width, flex: 1}}/>
    </div>
  );
}

export default Container;
