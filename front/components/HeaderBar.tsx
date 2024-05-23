import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { IconButton,  } from "react-native-paper";
import { colors } from "../assets/colors";

interface Props {
  children: any;
  onPress: () => void;
}

const HeaderBar = ({ children, onPress }: Props) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButton icon="chevron-left" size={44} onPress={onPress} iconColor={colors.gray7}/>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{children}</Text>
      </View>
      <View style={styles.buttonContainer}/>
    </View>
  )
}

export default HeaderBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 83,
    backgroundColor: colors.white
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
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  }
});