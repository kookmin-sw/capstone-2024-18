import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Pressable } from "react-native-paper/lib/typescript/components/TouchableRipple/Pressable";
import { colors } from "../assets/colors";

interface Props {
  children: any;
  onPress: () => void;
}

const Title = ({ children, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButton icon="chevron-left" size={44} onPress={onPress}/>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{children}</Text>
      </View>
      <View style={styles.buttonContainer}/>
    </View>
  )
}

export default Title;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 83,
  },
  text: {
    color: colors.point,
    fontSize: 24,
    fontFamily: "Pretendard-SemiBold",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  }
});