import { ChatProps } from "../components/chat/Chat";
import { areDatesEqual, areMinutesEqual } from "./dateTimeUtils";

export const getIsDailyInitial = (prevChat: ChatProps | undefined, chat: ChatProps | undefined) => {
  const isInitial = prevChat === undefined || !areDatesEqual(prevChat.sendTime, chat?.sendTime);
  return isInitial;
}

export const getIsInitial = (prevChat: ChatProps | undefined, chat: ChatProps | undefined) => {
  const isInitial = prevChat === undefined || !areMinutesEqual(prevChat.sendTime, chat?.sendTime) || prevChat?.senderId !== chat?.senderId;
  return isInitial;
}

export const getIsFinal = (chat: ChatProps | undefined, nextChat: ChatProps | undefined) => {
  const isFinal = nextChat === undefined || !areMinutesEqual(nextChat.sendTime, chat?.sendTime) || nextChat?.senderId !== chat?.senderId;
  return isFinal;
}