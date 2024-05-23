import IconText from "../components/IconText";
import { View } from "react-native";

// 아이콘 목록 참조
// https://callstack.github.io/react-native-paper/docs/guides/icons/

const TextInputTestPage = () => {
  return (
    <View style={{margin: 40}}>
      <IconText icon={{source: "camera"}} containerStyle={{borderWidth: 1}}>안녕하세요</IconText>
    </View>
  )
}

export default TextInputTestPage;