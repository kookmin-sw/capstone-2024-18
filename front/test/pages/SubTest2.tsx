import { View, Text, Button } from 'react-native';
import { useNavigate } from "react-router-native";


const SubTest2 = () => {
  const navigate = useNavigate();

  return (
    <View style={{margin: 100, alignSelf: 'center'}}>
      <Text style={{fontSize: 20}}>SubTest2창</Text>
      <Button title={"Test3"} onPress={() => {navigate("/test3")}}/>
    </View>
  );
};

export default SubTest2;