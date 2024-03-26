import CustomTextInput from "../components/CustomTextInput";
import { View } from "react-native";

// 아이콘 목록 참조
// https://callstack.github.io/react-native-paper/docs/guides/icons/

const TextInputTestPage = () => {
  return (
    <View style={{margin: 40}}>
      <CustomTextInput 
        placeholder="이메일을 입력해주세요" 
        leftIcon={{source: "email"}} 
        leftPressable={{onPress: () => {console.log("Pressed")}}}
      />
    </View>
  )
}

export default TextInputTestPage;