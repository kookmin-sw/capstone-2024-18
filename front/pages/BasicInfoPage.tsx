import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { Card } from "react-native-paper";

import IconText from "../components/IconText";
import HeaderBar from "../components/HeaderBar";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import CustomSlider from "../components/CustomSlider";
import CustomProgressBar from "../components/CustomProgressBar";
import { AuthContext } from "../store/auth-context";

import { colors } from "../assets/colors";
import { ageDegree, ageGroup, heightGroup, region, gender, HeightGroup, Gender, AgeGroup, AgeDegree, Region } from "../util/basicInfoFormat";
import { isBasicInfoResponse, isErrorResponse, isValidResponse, putBasicInfo } from "../util/auth";
import SelectableTag from "../components/SelectableTag";
import CustomBackHandler from "../components/CustomBackHandler";
import { UserContext } from "../store/user-context";
import { AlertContext } from "../store/alert-context";

const BasicInfoPage = ({navigation}: any) => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const { createAlertMessage } = useContext(AlertContext);

  const {height} = useWindowDimensions();
  
  interface BasicInfo {
    nickname: string;         
    nicknameState: string;  // "DEFALUT", "VALID", "INVALID"
    gender: string;         // "DEFAULT", "MALE", "FEMALE"
    ageGroup: string;       // "DEFAULT", "TWENTIES", "THIRTIES", ...
    ageDegree: string;      // "DEFALUT", "EARLY", "MIDDLE", "LATE"
    height: string;         // "DEFALUT", "FIFTIES", "SIXTIES", ...
    region: string;         // "DEFAULT", "GANGNAM_SEOCHO_YANGJAE", ...
  }

  const [pageIndex, setPageIndex] = useState(0);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    nickname: "",
    nicknameState: "DEFAULT",
    gender: "DEFAULT",
    ageGroup: "DEFAULT",
    ageDegree: "DEFAULT",
    height: "DEFAULT",
    region: "DEFAULT",
  })

  const [sliderIndex, setSliderIndex] = useState({
    ageDegree: -1,
    height: -1,
  })

  const handlePrevPage = () => {
    if (pageIndex === 0) {
      navigation.goBack();
    }
    setPageIndex(pageIndex - 1);
  }

  const handleNextPage = () => {
    if (pageIndex === 0 && basicInfo.nickname === "") {
      setBasicInfo({...basicInfo, nicknameState: "INVALID"});
    }
    if (isFormValid()) {
      setPageIndex(pageIndex + 1);
    }
  }

  const handleNicknameOnChange = (value: string) => {
    const regex = /^[ㄱ-힣A-Za-z0-9]{1,10}$/;
    console.log(value, regex.test(value));
    setBasicInfo({...basicInfo, nickname: value, nicknameState: regex.test(value) ? "VALID" : "INVALID"});
  }
  
  const handleSelectGender = (value: string) => {
    setBasicInfo({...basicInfo, gender: value});
  }

  const handleSelectAgeGroup = (value: string) => {
    setBasicInfo({...basicInfo, ageGroup: value});
  }

  const handleSelectAgeDegree = (index: number) => {
    const value = Object.keys(ageDegree)[index];
    if (value !== basicInfo.ageDegree) {
      setBasicInfo({...basicInfo, ageDegree: value});
      setSliderIndex({...sliderIndex, ageDegree: index})
    }
  }

  const handleChangeHeightSliderIndex = (index: number) => {
    const value = Object.keys(heightGroup)[index];
    if (value !== basicInfo.height) {
      setBasicInfo({...basicInfo, height: value});
      setSliderIndex({...sliderIndex, height: index});
    }
  }

  const handleSelectRegion = (value: string) => {
    setBasicInfo({...basicInfo, region: value});
  }

  const isFormValid = () => {
    switch(pageIndex) {
      case 0:
        return basicInfo.nicknameState === "VALID";
      case 1:
        return basicInfo.gender !== "DEFAULT";
      case 2:
        return basicInfo.ageDegree !== "DEFAULT" && basicInfo.ageGroup !== "DEFAULT";
      case 3:
        return basicInfo.height !== "DEFAULT";
      case 4:
        return basicInfo.region !== "DEFAULT";
      case 5:
        return true;
      default:
        return false;
    }
  }

  const submitForm = async () => {
    console.log("submitForm: " + JSON.stringify(basicInfo));
    if (authCtx.accessToken) {
      const response = await putBasicInfo(
        authCtx.accessToken,
        basicInfo.nickname,
        basicInfo.gender,
        basicInfo.ageGroup,
        basicInfo.ageDegree,
        basicInfo.height,
        basicInfo.region,
      );  
      if (isErrorResponse(response)) {
        createAlertMessage(response.message);
      }
      else if (isValidResponse(response)) {
        createAlertMessage("기본 정보 입력이 완료되었습니다.");
        userCtx.setStatus('BASIC_INFO_EXIST');
        userCtx.setBasicinfo({
          ageDegree: basicInfo.ageDegree, 
          ageGroup: basicInfo.ageGroup, 
          gender: basicInfo.gender, 
          heightGroup: basicInfo.height, 
          nickname: basicInfo.nickname, 
          region: basicInfo.region
        });
        console.log("goback");
        navigation.goBack();
      }
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }
  }
  
  // 닉네임 설정 페이지
  const nicknameContent = (
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>닉네임 설정</Text>
      </View>
      <CustomTextInput 
        placeholder="닉네임을 입력해주세요" 
        value={basicInfo.nickname} 
        onChangeText={handleNicknameOnChange} 
        isValid={basicInfo.nicknameState === "VALID" || basicInfo.nicknameState === "DEFAULT"}
      />
      <View style={styles.iconTextContainer}>
        <IconText icon={{ source: "information" }}>한글 + 영문 + 숫자 총 10자 이하</IconText>
      </View>
    </>
  );

  // 성별 설정 페이지
  const genderContent = (
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>성별</Text>
      </View>
      <View style={styles.genderButtonContainer}>
        <CustomButton 
          onPress={() => { handleSelectGender("MALE")}}
          containerStyle={basicInfo.gender === "MALE" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
          textStyle={basicInfo.gender === "MALE" ? styles.selectedGenderButtonText : styles.genderButtonText}
        >남</CustomButton>
        <View style={styles.genderButtonSeparator}/>
        <CustomButton 
          onPress={() => { handleSelectGender("FEMALE")}}
          containerStyle={basicInfo.gender === "FEMALE" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
          textStyle={basicInfo.gender === "FEMALE" ? styles.selectedGenderButtonText : styles.genderButtonText}
        >여</CustomButton>
      </View>
    </>
  );

  // 나이대 설정 페이지
  const ageContent = (
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>나이대</Text>
      </View>
      <View>
        <View style={styles.ageButtonContainer}>
          <CustomButton 
            onPress={() => { handleSelectAgeGroup("TWENTIES") }}
            containerStyle={basicInfo.ageGroup === "TWENTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
            textStyle={basicInfo.ageGroup === "TWENTIES" ? styles.selectedGenderButtonText : styles.genderButtonText}
          >20대</CustomButton>
          <View style={styles.ageButtonSeparator}/>
          <CustomButton 
            onPress={() => { handleSelectAgeGroup("THIRTIES") }}
            containerStyle={basicInfo.ageGroup === "THIRTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
            textStyle={basicInfo.ageGroup === "THIRTIES" ? styles.selectedGenderButtonText : styles.genderButtonText}
          >30대</CustomButton>
        </View>
        <View style={styles.ageButtonSeparator}/>
        <View style={styles.ageButtonContainer}>
          <CustomButton 
            onPress={() => { handleSelectAgeGroup("FORTIES") }}
            containerStyle={basicInfo.ageGroup === "FORTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
            textStyle={basicInfo.ageGroup === "FORTIES" ? styles.selectedGenderButtonText : styles.genderButtonText}
          >40대</CustomButton>
          <View style={styles.ageButtonSeparator}/>
          <CustomButton 
            onPress={() => { handleSelectAgeGroup("FIFTIES") }}
            containerStyle={basicInfo.ageGroup === "FIFTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
            textStyle={basicInfo.ageGroup === "FIFTIES" ? styles.selectedGenderButtonText : styles.genderButtonText}
          >50대</CustomButton>
          <View style={styles.ageButtonSeparator}/>
          <CustomButton 
            onPress={() => { handleSelectAgeGroup("SIXTIES") }}
            containerStyle={basicInfo.ageGroup === "SIXTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}
            textStyle={basicInfo.ageGroup === "SIXTIES" ? styles.selectedGenderButtonText : styles.genderButtonText}
          >60대</CustomButton>
        </View>
      </View>
      <View style={{ height: 52 }}/>
      <CustomSlider index={sliderIndex.ageDegree} onChange={handleSelectAgeDegree} labels={["초반", "중반", "후반"]}/>
    </>
  );

  // 키 설정 페이지
  const heightContent = (
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>키</Text>
      </View>
      <CustomSlider index={sliderIndex.height} onChange={handleChangeHeightSliderIndex} labels={["160대\n이하", "160대", "170대", "180대", "190대\n이상"]}/>
    </>
  )

  // 지역 설정 페이지
  const regionContent = (
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>지역</Text>
      </View>
      <View style={[styles.innerContainer, {flex: 0}]}>
        {<View style={styles.tagContainer}>
          <SelectableTag 
            selectable={{
              select: false,
              selectedStyle: styles.primaryTag,
              unselectedStyle: styles.primaryTag,
              selectedTextStyle: styles.primaryTagText,
              unselectedTextStyle: styles.primaryTagText,
            }}
          >서울</SelectableTag>
        </View>}
      </View>
      <View style={{ borderColor: colors.gray3, borderTopWidth: 1, width: "100%", marginBottom: 12 }}/>
      <ScrollView nestedScrollEnabled>
        <View style={styles.innerContainer}>
          <View style={styles.tagContainer}>
            {Object.entries(region.SEOUL).map(([key, value]) => {
              if (key === "DEFAULT") return null;
              return (
                <SelectableTag 
                  onPress={() => { handleSelectRegion(key) }} key={key} selectable={{
                    select: basicInfo.region === key, 
                    selectedStyle: styles.selectedTag, 
                    selectedTextStyle: styles.selectedTagText,
                    unselectedStyle: styles.tag,
                    unselectedTextStyle: styles.tagText,
                  }}
                >{value}</SelectableTag>  
              )
            })}
          </View>
        </View>
      </ScrollView>
    </>
  )

  // 최종 확인 페이지
  const confirmContent = (
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>올바르게 작성되었는지 확인해주세요!</Text>
      </View>
      <View style={styles.ageButtonContainer}>
        <View style={styles.genderButtonStyle}>
          <Text style={styles.genderButtonText}>닉네임: {basicInfo.nickname}</Text>
        </View>
        <View style={styles.ageButtonSeparator}/>
        <View style={styles.genderButtonStyle}>
          <Text style={styles.genderButtonText}>{gender[basicInfo.gender as keyof Gender]}</Text>
        </View>
      </View>
      <View style={styles.ageButtonSeparator}/>
      <View style={styles.ageButtonContainer}>
        <View style={styles.genderButtonStyle}>
          <Text style={styles.genderButtonText}>
            {ageGroup[basicInfo.ageGroup as keyof AgeGroup]} {ageDegree[basicInfo.ageDegree as keyof AgeDegree]}
          </Text>
        </View>
        <View style={styles.ageButtonSeparator}/>
        <View style={styles.genderButtonStyle}>
          <Text style={styles.genderButtonText}>{heightGroup[basicInfo.height as keyof HeightGroup]}</Text>
        </View>
      </View>
      <View style={styles.ageButtonSeparator}/>
      <View style={styles.ageButtonContainer}>
        <View style={styles.genderButtonStyle}>
          <Text style={styles.genderButtonText}>{region["SEOUL"][basicInfo.region as keyof Region["SEOUL"]]}</Text>
        </View>
      </View>
    </>
  )

  const contents = [
    nicknameContent,
    genderContent,
    ageContent,
    heightContent,
    regionContent,
    confirmContent,
  ]

  useEffect(() => {
    // console.log("basicInfo:", basicInfo);
  }, [basicInfo])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: height }}>
      <CustomBackHandler onBack={handlePrevPage}/>
      <HeaderBar onPress={handlePrevPage}>기본 정보</HeaderBar>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Card style={styles.card}>
            <IconText icon={{source: require('../assets/images/question.png'), size: 18, color: colors.gray7}} textStyle={styles.cardText}>기본 정보는 왜 필요한가요? 🤔</IconText>
          </Card>
          <View style={styles.textContainer}>
            <Text style={styles.text}>다른 사용자와 관계를 시작하기 전,{"\n"} 서로 최소한의 인적 사항을 참고하기 위함이에요.</Text>
          </View>
          {contents[pageIndex]}
        </View>
        <CustomProgressBar progress={(pageIndex + 1) / 6}/>
        <View style={{ height: 27 }}/>
        <View style={styles.bottomContainer}>
          <CustomButton disabled={!isFormValid()}
          containerStyle={isFormValid() ? styles.activatedButtonStyle : styles.disabledButtonStyle} 
          onPress={pageIndex === contents.length - 1 ? submitForm : handleNextPage}
          textStyle={isFormValid() ? styles.activatedTextStyle : styles.disabledTextStyle}
          >{pageIndex === contents.length - 1 ? "완료" : "다음"}</CustomButton>
        </View>
      </View>
    </ScrollView>
  )
}

export default BasicInfoPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white, 
    flex: 1, 
    paddingHorizontal: 32, 
  },
  innerContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
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
  },
  cardText: {
    paddingLeft: 5, 
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
    fontFamily: "Pretendard-Regular",
  },
  iconTextContainer: {
    width: "100%",
    padding: 8,
    justifyContent: "flex-start",
  },
  activatedButtonStyle: {
    backgroundColor: colors.point,
    elevation: 4
  },
  activatedTextStyle: {
    fontFamily: "Pretendard-SemiBold",
    fontWeight: "400", 
    fontSize: 18,
    color: colors.white,
  },
  disabledButtonStyle: {
    backgroundColor: colors.pastel_point,
    elevation: 4
  },
  disabledTextStyle: {
    fontFamily: "Pretendard-SemiBold",
    fontWeight: "400", 
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
  }
})
