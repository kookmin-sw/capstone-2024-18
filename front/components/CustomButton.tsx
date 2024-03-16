import { Text, TouchableOpacity, View } from 'react-native';


interface Props {
  text: string
  color: string
  font_color: string
  onPress(): void
  font_under_line?: boolean
  fit?: boolean
}


/**
 * 
 * @param text :string. 버튼 안에 표시할 글자
 * @param color :string. 버튼 색깔
 * @param font_color :string. 글자 색깔
 * @param onPress :function. 버튼 클릭 시 실행 할 함수
 * @param font_under_line :boolean. 글자 밑줄 설정
 * @param fit :boolean. 글자 크기와 비슷한 버튼 설정 
 */
const CustomButton = ({ text, color, font_color, onPress, font_under_line=false, fit=false} : Props) => {
  return (
    <View style={{flexDirection: 'row', alignSelf: 'center', margin: 5}}>
      <TouchableOpacity onPress={onPress} style={{alignItems: "center", borderRadius: 10 , backgroundColor: color, padding: fit ? 5 : 14.5, flex: fit ? 0 : 1}}>
        <Text style={{color: font_color, fontSize: fit ? 14 : 18, borderBottomWidth: font_under_line ? 0.5 : 0}} children={text}/>
      </TouchableOpacity>
  </View>);
}

export default CustomButton;