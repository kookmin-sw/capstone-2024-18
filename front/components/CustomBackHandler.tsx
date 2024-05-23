import React, { useEffect } from 'react';
import { Alert, BackHandler, BackHandlerStatic } from 'react-native';
import { createAlertMessage } from '../util/alert';

interface BackHandlerProps {
  onBack?: () => void;
  haveExit?: boolean
}

const CustomBackHandler: React.FC<BackHandlerProps> = ({ onBack, haveExit=false }) => {
  let lastBackPressTime = 0;

  useEffect(() => {
    const backAction = () => {
      onBack && onBack(); // 뒤로가기 이벤트가 발생할 때 호출할 콜백 함수

      if (haveExit) {
        const now = Date.now();
        if (lastBackPressTime && now - lastBackPressTime < 500) {
          // 마지막 뒤로가기 버튼 클릭이 0.5초 이내에 발생하면 앱 종료
          createAlertMessage("앱을 종료하시겠습니까?", BackHandler.exitApp)
          return true;
        }
        lastBackPressTime = now;
      }
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
