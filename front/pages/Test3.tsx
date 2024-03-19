import { View, Text, Button } from 'react-native';
import { useNavigate } from "react-router-native";


const Test3 = () => {
  const navigate = useNavigate();
  
  return (
    <View style={{margin: 100, alignSelf: 'center'}}>
      <Text style={{fontSize: 20}}>Test3창</Text>
      <Button title={"Test1"} onPress={() => {navigate("/test1")}}/>
    </View>
  );
};

export default Test3;