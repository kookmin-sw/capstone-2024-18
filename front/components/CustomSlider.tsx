import { Slider } from "@miblanchard/react-native-slider"
import { View, Text, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { colors } from "../assets/colors"

interface Props {
  values: string[];
  setValue: (index: number) => void;
}

const CustomSlider = ({ values, setValue }: Props) => {
  const [sliderIndex, setSliderIndex] = useState(-1);

  const handleOnChange = (value: number) => {
    setSliderIndex(value);
    setValue(value);
  }

  useEffect(() => {
    console.log(sliderIndex);
  }, [sliderIndex])

  return (
    <View style={{ width: values.length * 50 }}>
      <View style={{ marginHorizontal: 5 }}>
        <Slider 
          minimumValue={0}
          maximumValue={values.length - 1}
          step={1}
          minimumTrackTintColor={colors.gray2}
          maximumTrackTintColor={colors.gray2}
          thumbStyle={styles.thumbStyle}
          onValueChange={(sliderValue) => handleOnChange(sliderValue[0])}
        />
      </View>
      <View style={styles.tickContiner}>
        {values.map((value, index) => {
          return <View key={index} style={index === sliderIndex ? styles.knobStyle : styles.tickStyle}/>
        })}
      </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          {values.map( value => <Text key={value} style={{color: colors.gray7, textAlign: "center"}}>{value}</Text>)}
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
    borderRadius: 11, 
    alignSelf: "center",
    pointerEvents: "none",
  },
})