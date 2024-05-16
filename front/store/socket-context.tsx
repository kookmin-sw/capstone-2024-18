import { Client, IMessage } from "@stomp/stompjs";
import { createContext, useMemo, useState, useContext, useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { AuthContext } from "./auth-context";
import Config from "react-native-config";
import axios from "axios";
import { createAlertMessage } from "../util/alert";

const LOCALHOST = Config.LOCALHOST;
const SOCKET_URL = Config.SOCKET_URL;

interface StompClientContextType {
  stompClient: Client | null,
  subscribe: (path: string, callback: (message: IMessage) => void) => void,
  unsubscribe: (path: string) => void,
  connect: () => void,
  disconnect: () => void,
}

export const StompClientContext = createContext<StompClientContextType>({
  stompClient: null,
  subscribe: (path: string, callback: (message: IMessage) => void) => {},
  unsubscribe: (path: string) => {},
  connect: () => {},
  disconnect: () => {},
});

interface StompClientProviderProps {
  children: React.ReactNode;
}

const StompClientContextProvider: React.FC<StompClientProviderProps> = ({ children }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [subscriptions, setSubscriptions] = useState(new Map<string, any>());
  
  const authCtx = useContext(AuthContext);

  const connect = useCallback(() => {
    console.log("connect", authCtx.accessToken);
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
    };

    client.onDisconnect = () => {
      console.log('STOMP Client disconnected');
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    setStompClient(client);
  }, [stompClient, authCtx.accessToken]);

  const disconnect = useCallback(async () => {
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    subscriptions.clear();
    stompClient?.deactivate();
    setSubscriptions(new Map());
    const method = 'disconnect: ' + authCtx.accessToken + '\n';
    const endpoint = `${LOCALHOST}/stomp/disconnect`;
    const config = { 
      headers: { Authorization: 'Bearer ' + authCtx.accessToken } 
    };
    try {
      const response = await axios.post(endpoint, config);
      console.log(method, response.data);
    }
    catch (error) {
      console.log(method, error);
    }
  }, [stompClient, authCtx.accessToken]);

  const subscribe = useCallback((path: string, callback: (message: IMessage) => void) => {
    console.log('@@@@@@@@@@@@@@@@@@@' + !stompClient);
    if (!stompClient) return;
    console.log('@@@@@@@@@@@@@@@@@@@' + subscriptions.has(path));
    if (subscriptions.has(path)) return;

    const intervalId = setInterval(() => {
      console.log('@@@@@@@@@@@@@@@@@@@ 구독 시도');

      if (!stompClient.connected) return;
      console.log("subscribe");
      createAlertMessage('subscribe');
      const subscription = stompClient.subscribe(path, callback);
      setSubscriptions((prev) => new Map(prev).set(path, subscription));
      stompClient.publish({
        destination: '/pub/stomp/connect',
        headers: { Authorization: `Bearer ${authCtx.accessToken}` },
      });
      clearInterval(intervalId);
    }, 100);
  }, [stompClient, subscriptions]);

  const unsubscribe = useCallback((path: string) => {
    console.log("unsubscribe");
    const subscription = subscriptions.get(path);
    if (subscription) {
      subscription.unsubscribe();
      setSubscriptions((prev) => {
        const newSubscriptions = new Map(prev);
        newSubscriptions.delete(path);
        return newSubscriptions;
      });
    }
  }, [stompClient, subscriptions]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log("nextAppState:", nextAppState, "authCtx.status:", authCtx.status);
      if (authCtx.status === 'INITIALIZED' && nextAppState === 'active') {
        connect();
      } else if (nextAppState !== 'active' && authCtx.status === 'INITIALIZED') {
        disconnect();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [authCtx.status]);
  
  const value = useMemo(() => ({
    stompClient,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
  }), [stompClient]);

  return <StompClientContext.Provider value={value}>{children}</StompClientContext.Provider>;
};

export default StompClientContextProvider;
