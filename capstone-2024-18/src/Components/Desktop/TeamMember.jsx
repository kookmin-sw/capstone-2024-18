function TeamMember({name, image, contents}) {
    return (
      <div style={{borderRadius: 10, padding: 10,marginBottom: 20, backgroundColor: '#FFF8F7', flexDirection: 'row', display: 'flex', borderStyle: 'solid', borderWidth: 0.3, borderColor: '#C6302B'}}>
        <img src={image} width={100} height={100} style={{position: 'relative', margin: 0}}/>
        <div style={{marginLeft: 20, alignSelf: 'center'}}>
          <text>{name}</text>
          <div dangerouslySetInnerHTML={{__html: contents}}/>
        </div>
      </div>
    );
  }
  
  export default TeamMember;
  