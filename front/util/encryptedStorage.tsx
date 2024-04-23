import EncryptedStorage from 'react-native-encrypted-storage';

// 리프레시 토큰 저장하기
export const saveToken = async (tokenType: "accessToken" | "refreshToken", refreshToken: string) => {
    try {
        await EncryptedStorage.setItem(tokenType, refreshToken);
        console.log(tokenType + "저장 성공: ");
    } catch (error) {
        console.log(tokenType + "저장 실패", error);
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
