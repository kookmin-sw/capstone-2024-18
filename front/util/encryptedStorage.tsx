import EncryptedStorage from 'react-native-encrypted-storage';

// 리프레시 토큰 저장하기
export const saveRefreshToken = async (refreshToken: string) => {
    try {
        await EncryptedStorage.setItem("refreshToken", refreshToken);
        console.log("Refresh token safely stored");
    } catch (error) {
        console.log("Saving refresh token failed", error);
    }
};

// 리프레시 토큰 불러오기
export const loadRefreshToken = async () => {
    try {
        const refreshToken = await EncryptedStorage.getItem("refreshToken");
        if (refreshToken !== undefined) {
            console.log("Refresh token loaded", refreshToken);
            return refreshToken;
        }
    } catch (error) {
        console.log("Loading refresh token failed", error);
    }
};

// 리프레시 토큰 삭제하기
export const removeRefreshToken = async () => {
    try {
        await EncryptedStorage.removeItem("refreshToken");
        console.log("Refresh token removed");
    } catch (error) {
        console.log("Removing refresh token failed", error);
    }
};
