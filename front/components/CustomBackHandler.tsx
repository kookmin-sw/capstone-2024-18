import React, { useEffect } from 'react';
import { BackHandler, BackHandlerStatic } from 'react-native';

interface BackHandlerProps {
  onBack: () => void;
}

const CustomBackHandler: React.FC<BackHandlerProps> = ({ onBack }) => {
  useEffect(() => {
    const backAction = () => {
      onBack(); // 뒤로가기 이벤트가 발생할 때 호출할 콜백 함수
      return true; // 기본 뒤로가기 동작 막기
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [onBack]);

  // UI를 렌더링하지 않으므로 null을 반환합니다.
  return null;
};

export default CustomBackHandler;
