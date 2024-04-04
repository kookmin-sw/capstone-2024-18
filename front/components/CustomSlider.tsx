import { Slider } from "@miblanchard/react-native-slider"
import { View, Text } from "react-native"
import { useState, useEffect } from "react"
import { colors } from "../assets/colors"

interface Props {
  values: string[];
  setValue: (index: number) => void;
}

const CustomSlider = ({ values, setValue }: Props) => {

  return (
    <View style={{ width: values.length * 50 }}>
      <View style={{ paddingHorizontal: 5 }}>
        <Slider 
          minimumValue={0}
          maximumValue={values.length - 1}
          step={1}
          minimumTrackTintColor={colors.gray4}
          maximumTrackTintColor={colors.gray4}
          thumbTintColor={colors.pastel_point}
          onValueChange={(sliderValue) => setValue(sliderValue[0])}
        />
      </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          {values.map( value => <Text key={value} style={{color: colors.gray7, textAlign: "center"}}>{value}</Text>)}
        </View>  
    </View>
  )
}

export default CustomSlider;