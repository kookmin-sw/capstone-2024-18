import React from 'react';
import { colors } from '../assets/colors';
import { ProgressBar, ProgressBarProps } from 'react-native-paper';

const CustomProgressBar = ({ progress, style, fillStyle, ...ProgressProps }: ProgressBarProps) => {

  return (
    <ProgressBar 
      progress={progress} 
      color={colors.pastel_point} 
      style={[{backgroundColor: colors.gray1, height: 6, borderRadius: 8}, style]} 
      fillStyle={[{borderRadius: 8}, fillStyle]} 
      {...ProgressProps} 
    />
  );
};

export default CustomProgressBar;
