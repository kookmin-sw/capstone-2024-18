import React, { createContext, useState, useMemo } from 'react';
import { CustomAlertProps } from '../components/CustomAlert';

interface AlertContextType {
  alert: CustomAlertProps,
  setAlert: (alert: CustomAlertProps) => void,
  createAlertMessage: (message: string, onConfirm?: () => void) => void;
}

const defaultAlert = { 
  isVisible: false, 
  message: '', 
  onClose: () => {}, 
  onConfirm: undefined 
};

export const AlertContext = createContext<AlertContextType>({
  alert: defaultAlert,
  setAlert: (alert: CustomAlertProps) => {},
  createAlertMessage: (message: string, onConfirm?: () => void) => {},
});

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertContextProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<CustomAlertProps>(defaultAlert);

  const onClose = () => {
    setAlert((prevAlert) => {
      return { ...prevAlert, isVisible: false };
    })
  }

  const createAlertMessage = (message: string, onConfirm?: () => void) => {
    setAlert({
      isVisible: true,
      message,
      onClose,
      onConfirm: onConfirm ? () => { onConfirm(); onClose(); } : undefined
    });
  };

  const value = useMemo(() => ({
    alert,
    setAlert,
    createAlertMessage,
  }), [alert]);

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export default AlertContextProvider;
