import { ChatProps } from "../components/chat/Chat";
import { areDatesEqual, areMinutesEqual } from "./dateTimeUtils";

export const getIsDailyInitial = (prevChat: ChatProps | undefined, chat: ChatProps | undefined) => {
  const isInitial = prevChat === undefined || !areDatesEqual(prevChat.sendTime, chat?.sendTime);
  return isInitial;
}

export const getIsInitial = (prevChat: ChatProps | undefined, chat: ChatProps | undefined) => {
  const isInitial = prevChat === undefined || !areMinutesEqual(prevChat.sendTime, chat?.sendTime) || prevChat?.id !== chat?.id;
  return isInitial;
}

export const getIsFinal = (chat: ChatProps | undefined, nextChat: ChatProps | undefined) => {
  const isFinal = nextChat === undefined || !areMinutesEqual(nextChat.sendTime, chat?.sendTime) || nextChat?.id !== chat?.id;
  return isFinal;
}