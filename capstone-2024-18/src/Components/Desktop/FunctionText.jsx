import classes from './DesktopPage.module.css';

function FunctionText({title, contents}) {
  return (
    <div style={{flex: 1, marginTop: 20}}>
      <div style={{display: 'flex', flexDirection: 'column', minHeight: '60%'}}>
        <div style={{width: 'fit-content', marginLeft: 20, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: '#FF847D', borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
          <text id={classes.subtitle} style={{fontWeight: 'bold'}}>{title}</text>
        </div>
        <div style={{borderRadius: 20, background: '#FFFFFF60', padding: 30, flex: 1, alignContent: 'center'}}>
          <div id={classes.contentSubTitle} dangerouslySetInnerHTML={{__html: contents}}/>
        </div>
      </div>
    </div>
  );
}

export default FunctionText;
