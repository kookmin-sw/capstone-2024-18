import EncryptedStorage from 'react-native-encrypted-storage';
import { ChatProps } from '../components/chat/Chat';

// 리프레시 토큰 저장하기
export const saveToken = async (tokenType: "accessToken" | "refreshToken", token: string) => {
    try {
        await EncryptedStorage.setItem(tokenType, token);
        console.log(tokenType, "저장 성공:", token);
    } catch (error) {
        console.log(tokenType, "저장 실패", error);
    }
};

// 리프레시 토큰 불러오기
export const loadToken = async (tokenType: "accessToken" | "refreshToken") => {
    try {
        const token = await EncryptedStorage.getItem(tokenType);
        if (token) {
            console.log(tokenType + " 로딩 성공: ", token);
        }
        else {
            console.log(tokenType + " 로딩 실패");
        }
        return token;
    } catch (error) {
        console.log(tokenType + " 로딩 실패", error);
    }
};

// 리프레시 토큰 삭제하기
export const removeToken = async (tokenType: "accessToken" | "refreshToken") => {
    try {
        await EncryptedStorage.removeItem(tokenType);
        console.log(tokenType + " 삭제 성공");
    } catch (error) {
        console.log(tokenType + " 삭제 실패", error);
    }
};

export const saveChatHistory = async (chats: ChatProps[]) => {
    try {
        const JSONChatHistory = JSON.stringify(chats);
        await EncryptedStorage.setItem("chats", JSONChatHistory);
        console.log("채팅 내역 저장 성공: ", chats);
    } catch (error) {
        console.log("채팅 내역 저장 실패", error);
    }
};

export const loadChatHistory = async () => {
    try {
        const JSONChatHistory = await EncryptedStorage.getItem("chats");
        const chatHistory = JSONChatHistory ? JSON.parse(JSONChatHistory) : [];
        if (chatHistory) {
            console.log("채팅 내역 로딩 성공:", chatHistory);
        }
        else {
            console.log("채팅 내역 로딩 실패");
        }
        return chatHistory;
    } catch (error) {
        console.log("채팅 내역 로딩 실패", error);
    }
}

export const removeChatHistoryByUuid = async (uuid: string) => {
    try {
        const chatHistory = await loadChatHistory() as ChatProps[];
        const newChatHistory = chatHistory.filter((chat) => chat.uuid !== uuid);
        saveChatHistory(newChatHistory);
    } catch (error) {
        console.log("채팅 내역 삭제 실패", error);
    }
};

export const clearChatHistory = async () => {
    try {
        const JSONChatHistory = JSON.stringify([]);
        await EncryptedStorage.setItem("chats", JSONChatHistory);
        console.log("채팅 내역 초기화 성공");
    } catch (error) {
        console.log("채팅 내역 초기화 실패");
    }
};