import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../assets/colors';

export interface CustomAlertProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isVisible, message, onClose, onConfirm }) => {

  const buttonContent = onConfirm ?
    <>
      <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>취소</Text>
      </TouchableOpacity>
      <View style={{ marginRight: 10 }}/> 
      <TouchableOpacity onPress={onConfirm} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>확인</Text>
      </TouchableOpacity>
    </> :
    <>
      <View style={{ flex: 1 }}/>
      <TouchableOpacity onPress={onClose} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>확인</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}/>
    </>

  return (
    <Modal 
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.3}
    >
      <View style={styles.modalContent}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          {buttonContent}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: colors.white,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: colors.pastel_point,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular', 
    marginVertical: 40,
    textAlign: 'center',
    color: colors.gray7,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  primaryButton: {
    flex: 2,
    backgroundColor: colors.point,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular', 
    letterSpacing: -16* 0.02,
  },
  secondaryButton: {
    flex: 2,
    backgroundColor: colors.pastel_point,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular', 
    letterSpacing: -16* 0.02,
  },
});

export default CustomAlert;
