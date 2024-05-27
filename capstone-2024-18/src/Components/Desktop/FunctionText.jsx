function FunctionText({title, contents}) {
  return (
    <div style={{marginLeft: 20, marginRight: 20}}>
      <div style={{display: 'inline-block', marginLeft: 20, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: '#FF847D', borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
        <text>{title}</text>
      </div>
      <div style={{borderRadius: 20, background: '#FFFFFF60', padding: 10}}>
        <div dangerouslySetInnerHTML={{__html: contents}}/>
      </div>
    </div>
  );
}

export default FunctionText;
