import { Slider } from "@miblanchard/react-native-slider"
import { View, Text, StyleSheet } from "react-native"
import { colors } from "../assets/colors"

interface Props {
  labels: string[];
  index: number;
  onChange: (index: number) => void;
}

const CustomSlider = ({ labels, index, onChange }: Props) => {

  return (
    <View style={{ width: labels.length * 50 }}>
      <View style={{ marginHorizontal: 5 }}>
        <Slider 
          minimumValue={0}
          maximumValue={labels.length - 1}
          step={1}
          minimumTrackTintColor={colors.gray2}
          maximumTrackTintColor={colors.gray2}
          thumbStyle={styles.thumbStyle}
          onValueChange={(sliderValue) => onChange(sliderValue[0])}
          value={index}
        />
      </View>
      <View style={styles.tickContiner}>
        {labels.map((_, i) => {
          return <View key={i} style={i === index ? styles.knobStyle : styles.tickStyle}/>
        })}
      </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          {labels.map(value => <Text key={value} style={{color: colors.gray7, textAlign: "center"}}>{value}</Text>)}
        </View>  
    </View>
  )
}

export default CustomSlider;

const styles = StyleSheet.create({
  thumbStyle: {
    borderWidth: 1, 
    borderColor: colors.point, 
    backgroundColor: colors.pastel_point,
  },
  tickContiner: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    paddingHorizontal: 5,
    pointerEvents: "none",
    height: 40,
  },
  tickStyle: {
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: colors.gray4, 
    backgroundColor: colors.gray2, 
    alignSelf: "center",
    pointerEvents: "none",
  },
  knobStyle: {
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    alignSelf: "center",
    pointerEvents: "none",
  },
})