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
            console.log(tokenType + " 로딩 성공:", token);
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

export const saveChatHistory = async (chats: {[roomid: number]: ChatProps[]}, userId: number) => {
    try {
        const JSONChatHistory = JSON.stringify(chats);
        await EncryptedStorage.setItem(`chats-${userId}`, JSONChatHistory);
        console.log("채팅 내역 저장 성공:", chats);
    } catch (error) {
        console.log("채팅 내역 저장 실패", error);
    }
};

export const loadChatHistory = async (userId: number) => {
    try {
        const JSONChatHistory = await EncryptedStorage.getItem(`chats-${userId}`);
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

export const clearChatHistory = async () => {
    try {
        const JSONChatHistory = JSON.stringify([]);
        await EncryptedStorage.setItem("chats", JSONChatHistory);
        console.log("채팅 내역 초기화 성공");
    } catch (error) {
        console.log("채팅 내역 초기화 실패");
    }
};

export const saveData = async (userId: number, data: object) => {
    try {
        const JSONData = JSON.stringify(data);
        await EncryptedStorage.setItem(userId.toString(), JSONData);
        console.log("데이터 저장 성공:", data);
    } catch (error) {
        console.log("데이터 저장 실패", error);
    }
};

export const loadData = async (userId: number) => {
    try {
        const JSONData = await EncryptedStorage.getItem(userId.toString());
        const data = JSONData ? JSON.parse(JSONData) : { chats: {} };
        if (data) {
            console.log("데이터 로딩 성공:", data);
        }
        else {
            console.log("데이터 없음");
        }
        return data;
    } catch (error) {
        console.log("데이터 로딩 실패", error);
    }
}

export const saveCache = async (key: string, data: string | number) => {
    try {
        const JSONData = JSON.stringify(data);
        await EncryptedStorage.setItem(key, JSONData);
        console.log("캐시 저장 성공:", key, data);
    } catch (error) {
        console.log("캐시 저장 실패", error);
    }
}

export const loadCache = async (key: string) => {
    try {
        const JSONData = await EncryptedStorage.getItem(key);
        const data = JSONData ? JSON.parse(JSONData) : { chats: {} };
        if (data) {
            console.log("캐시 로딩 성공:", data);
        }
        else {
            console.log("캐시 없음");
        }
        return data;
    } catch (error) {
        console.log("캐시 로딩 실패", error);
    }
}