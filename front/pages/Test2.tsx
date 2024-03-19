import { View, Text, Button } from 'react-native';
import { useNavigate } from "react-router-native";


const Test2 = () => {
  const navigate = useNavigate();

  return (
    <View style={{margin: 100, alignSelf: 'center'}}>
      <Text style={{fontSize: 20}}>Test2창</Text>
      <Button title={"Test3"} onPress={() => {navigate("/test3")}}/>
    </View>
  );
};

export default Test2;