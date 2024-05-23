import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { createContext, useMemo, useState, useContext, useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { AuthContext } from "./auth-context";
import Config from "react-native-config";
import axios from "axios";
import { binaryBodyToString } from "../util/binaryBodyToString";
import { connect } from "react-redux";
import { AlertContext } from "./alert-context";

const LOCALHOST = Config.LOCALHOST;
const SOCKET_URL = Config.SOCKET_URL;

interface StompClientContextType {
  stompClient: Client | null,
  subscribe: (path: string, callback: (message: IMessage) => void) => void,
  connect: () => void,
  disconnect: () => void,
}

export const StompClientContext = createContext<StompClientContextType>({
  stompClient: null,
  subscribe: (path: string, callback: (message: IMessage) => void) => {},
  connect: () => {},
  disconnect: () => {},
});

interface StompClientProviderProps {
  children: React.ReactNode;
}

const StompClientContextProvider: React.FC<StompClientProviderProps> = ({ children }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const authCtx = useContext(AuthContext);

  const initializeSocket = () => {
    console.log("@@@@@@@@ initializeSocket @@@@@@@@@");
    const client = new Client({
      brokerURL: SOCKET_URL, 
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
      debug: (msg) => {
        console.log(msg);
      },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    client.onConnect = (frame) => {
      console.log("Connected: " + frame);
      connect();
    };

    client.onDisconnect = () => {
      console.log('STOMP Client disconnected');
      disconnect();
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    setStompClient(client);
  };

  const connect = () => {
    console.log("@@@@@@@@ connect @@@@@@@@@");
    stompClient?.publish({
      destination: '/pub/stomp/connect',
      headers: {
        Authorization: "Bearer " + authCtx.accessToken,
      },
    })
  };

  const disconnect = async () => {
    console.log("@@@@@@@@ disconnect @@@@@@@@@");
    const method = 'disconnect: ' + authCtx.accessToken + '\n';
    const endpoint = `${LOCALHOST}/stomp/disconnect`;
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      const response = await axios.post(endpoint, null, config);
      console.log(method, response.data);
    }
    catch (error) {
      console.log(method, error);
    }
  };
  
  const subscribe = (path: string, callback: (message: IMessage) => void) => {
    console.log("subscribe");
    if (stompClient === null) return;
    const subscription = stompClient.subscribe(path, callback);
  }

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log("nextAppState:", nextAppState, "authCtx.status:", authCtx.status);
      if (stompClient === null) return;
      if (nextAppState !== 'active' && stompClient.active) {
        stompClient.deactivate();
      } 
      if (nextAppState === 'active' && !stompClient.active) {
        stompClient.activate();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [stompClient]);

  useEffect(() => {
    if (authCtx.status === 'INITIALIZED') {
      initializeSocket();
    }
    if (authCtx.status === 'LOGGED_OUT') {
      if (stompClient?.active) stompClient.deactivate();
      setStompClient(null);
    }
  }, [authCtx.status])
  
  const value = useMemo(() => ({
    stompClient,
    subscribe,
    connect,
    disconnect,
  }), [stompClient]);

  return <StompClientContext.Provider value={value}>{children}</StompClientContext.Provider>;
};

export default StompClientContextProvider;
