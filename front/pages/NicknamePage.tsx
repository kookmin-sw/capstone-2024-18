import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Card, IconButton } from "react-native-paper";

import IconText from "../components/IconText";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { AuthContext } from "../store/auth-context";

import { colors } from "../assets/colors";
import { getBasicInfo, getFaceInfo, isBasicInfoResponse, isErrorResponse, isFaceInfoResponse, isValidResponse, putBasicInfo } from "../util/auth";
import { createAlertMessage } from "../util/alert";
import ImageWithIconOverlay from "../components/ImageWithIconOverlay";

const NicknamePage = ({navigation}: any) => {
  const authCtx = useContext(AuthContext);

  const [nickname, setNickName] = useState('');
  const [nicknameState, setNickNameState] = useState("DEFAULT");

  const [ generatedS3url, setgeneratedS3url ] = useState('');

  const handleNicknameOnChange = (value: string) => {
    const regex = /^[ㄱ-힣A-Za-z0-9]{1,10}$/;
    console.log(value, regex.test(value));
    setNickName(value);
    setNickNameState(regex.test(value) ? "VALID" : "INVALID");
  }

  const tryGetFaceInfo = async () => {
    if (authCtx.accessToken) {
      const response = await getFaceInfo(
        authCtx.accessToken
      );
      
      if (!isFaceInfoResponse(response)) {
        createAlertMessage(response.message);
      } else {
        setgeneratedS3url(response.generatedS3url);
      }
    } else { // 실제에서는 절대 없는 예외 상황
      console.log("로그인 정보가 없습니다.");
    }
  }

  const submitForm = async () => {
    console.log("submitForm: " + JSON.stringify(nickname));
    if (authCtx.accessToken) {
      const basicInfoResponse = await getBasicInfo(
        authCtx.accessToken,
      );
      if (isBasicInfoResponse(basicInfoResponse)) {
        const response = await putBasicInfo(
          authCtx.accessToken,
          nickname,
          basicInfoResponse.gender,
          basicInfoResponse.ageGroup,
          basicInfoResponse.ageDegree,
          basicInfoResponse.heightGroup,
          basicInfoResponse.region,
        );  

        if (isValidResponse(response)) {
          createAlertMessage("기본 정보 입력이 완료되었습니다.");
          navigation.goBack();
        }
        if (isErrorResponse(response)) {
          createAlertMessage(response.message);
        }
      }
      else {
        // 그런 경우 절대 없음
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }

  useEffect(() => {
    tryGetFaceInfo();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Card style={styles.card}>
            <IconText icon={{source: "chat-question", size: 18}} textStyle={styles.cardText}>기본 정보는 왜 필요한가요? 🤔</IconText>
          </Card>
          <View style={styles.textContainer}>
            <Text style={styles.text}>다른 사용자와 관계를 시작하기 전,{"\n"} 서로 최소한의 인적 사항을 참고하기 위함이에요.</Text>
          </View>
          <ImageWithIconOverlay
            borderRadius={300} source={{uri: generatedS3url}}
            containerStyle={styles.resultImageContainer} imageStyle={styles.image}>
            <IconButton icon={'check'} size={30} iconColor={colors.white} style={styles.resultBottomIcon}/>
          </ImageWithIconOverlay>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>닉네임 설정</Text>
          </View>
          <CustomTextInput 
            placeholder="닉네임을 입력해주세요" 
            value={nickname} 
            onChangeText={handleNicknameOnChange} 
            isValid={nicknameState === "VALID" || nicknameState === "DEFAULT"}/>
          <View style={styles.iconTextContainer}>
            <IconText icon={{ source: "information" }}>한글 + 영문 + 숫자 총 10자 이하</IconText>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CustomButton 
            containerStyle={nicknameState === "VALID" ? styles.activatedButtonStyle : styles.disabledButtonStyle} 
            onPress={submitForm}
            textStyle={nicknameState === "VALID" ? styles.activatedTextStyle : styles.disabledTextStyle}
          >완료</CustomButton>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default NicknamePage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", 
    flex: 1, 
    paddingHorizontal: 32, 
  },
  innerContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: colors.light_pink,
    width: 225,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 17,
  },
  cardText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    letterSpacing: -14 * 0.02,
  },
  textContainer: {
    marginVertical: 12,
  },
  text: {
    fontSize: 14,
    letterSpacing: -14* 0.04,
    textAlign: "center",
    color: colors.gray7,
    fontFamily: "Pretendard-Regualar",
  },
  iconTextContainer: {
    width: "100%",
    padding: 8,
    justifyContent: "flex-start",
  },
  activatedButtonStyle: {
    backgroundColor: colors.point,
  },
  activatedTextStyle: {
    fontSize: 18,
    color: colors.white,
  },
  disabledButtonStyle: {
    backgroundColor: colors.pastel_point,
  },
  disabledTextStyle: {
    fontSize: 18,
    color: colors.white,
  },
  genderButtonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    width: "100%",
    height: 80,
  },
  genderButtonStyle: {
    flex: 1,
    backgroundColor: colors.white,
    borderColor: "#FFB8B3",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.gray6,
  },
  selectedGenderButtonStyle: {
    flex: 1,
    borderColor: "#FF7269",
    backgroundColor: "#FFB8B3",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedGenderButtonText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.white,
  },
  genderButtonSeparator: {
    width: 10,
  },

  ageButtonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    width: "100%",
    height: 56,
  },
  ageButtonStyle: {
    flex: 1,
    borderColor: "#FFB8B3",
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ageButtonText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.gray7,
  },
  selectedAgeButtonStyle: {
    flex: 1,
    borderColor: "#FF7269",
    backgroundColor: "#FFB8B3",
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedAgeButtonText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.white,
  },
  ageButtonSeparator: {
    width: 10,
    height: 10,
  },
  

  subtitleContainer: {
    marginVertical: 32,
  },
  subtitleText: {
    fontSize: 18,
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: 18 * 0.02,
    color: colors.gray7,
  },
  slider: {
    marginVertical: 20,
  },
  labelContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  labelText: {
    color: '#000',
    fontSize: 16,
  },

  tagContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  primaryTag: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 33,
    backgroundColor: "#FF7269",
    borderColor: "#FF7269",
    borderWidth: 1,
    borderRadius: 8,
  },
  primaryTagText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.white,
    marginLeft: 0,
    marginRight: 0,
  },
  selectedTag: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    height: 33,
    backgroundColor: colors.pastel_point,
    borderColor: "#FFB8B3",
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedTagText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.gray7,
  },
  tag: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    height: 33,
    backgroundColor: colors.white,
    borderColor: "#FFB8B3",
    borderWidth: 1,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    letterSpacing: -18 * 0.02,
    color: colors.gray6,
  },

  resultImageContainer: {
    width: 200, 
    height: 200, 
    alignSelf: 'center', 
    borderRadius: 300, 
    borderWidth: 2,
    borderColor: colors.point,
    backgroundColor: colors.point,
    marginBottom: 27
  },
  // 이미지 설정 style
  image: {
    width: 196, 
    height: 196, 
  },
  // result창의 이미지 style
  resultBottomIcon: {
    backgroundColor: colors.point, 
    borderWidth: 1, 
    borderColor: colors.point,
    position: 'absolute', 
    bottom: -30, 
    left: 70,
  },
})
