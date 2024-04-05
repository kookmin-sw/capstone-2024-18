import { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Card } from "react-native-paper";

import IconText from "../components/IconText";
import Title from "../components/Title";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import CustomSlider from "../components/CustomSlider";
import CustomProgressBar from "../components/CustomProgressBar";
import { AuthContext } from "../store/auth-context";

import { colors } from "../assets/colors";
import { ageDegree, ageGroup, heightGroup, region, gender, HeightGroup, Gender, AgeGroup, AgeDegree, Region } from "../util/basicInfoFormat";
import { putBasicInfo } from "../util/auth";

const BasicInfoPage = () => {
  const authCtx = useContext(AuthContext);

  interface BasicInfo {
    nickname: string;
    gender: string;
    age: [string, string];
    height: string;
    region: string;
  }

  const [pageIndex, setPageIndex] = useState(0);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    nickname: "",
    gender: "DEFAULT",
    age: ["DEFAULT", "EARLY"],
    height: "DEFAULT",
    region: "DEFAULT",
  })

  const handlePrevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex(pageIndex - 1);
  }

  const handleNextPage = () => {
    if (isFormValid()) {
      setPageIndex(pageIndex + 1);
    }
  }

  const handleNicknameOnChange = (value: string) => {
    setBasicInfo({...basicInfo, nickname: value});
  }

  const handleSelectGender = (value: string) => {
    setBasicInfo({...basicInfo, gender: value});
  }

  const handleSelectAge = (value: string) => {
    setBasicInfo({...basicInfo, age: [value, basicInfo.age[1]]});
  }

  const setAgeSliderValue = (index: number) => {
    const value = Object.keys(ageDegree)[index];
    if (value !== basicInfo.age[1]) {
      setBasicInfo({...basicInfo, age: [basicInfo.age[0], value]});
    }
  }

  const setHeightSliderValue = (index: number) => {
    const value = Object.keys(heightGroup)[index];
    if (value !== basicInfo.height) {
      setBasicInfo({...basicInfo, height: value});
    }
  }

  const handleSelectRegion = (value: string) => {
    setBasicInfo({...basicInfo, region: value});
  }

  const isFormValid = () => {
    switch(pageIndex) {
      case 0:
        return !!basicInfo.nickname;
      case 1:
        return basicInfo.gender !== "DEFAULT";
      case 2:
        return basicInfo.age[0] !== "DEFAULT";
      case 3:
        return basicInfo.height !== "DEFAULT";
      case 4:
        return basicInfo.region !== "DEFAULT";
      case 5:
        submitForm();
        return true;
      default:
        return false;
    }
  }

  const submitForm = async () => {
    console.log("submit:" + JSON.stringify(basicInfo));
    if (authCtx.accessToken) {
      const response = await putBasicInfo(
        authCtx.accessToken,
        basicInfo.nickname,
        basicInfo.gender,
        basicInfo.age[0],
        basicInfo.age[1],
        basicInfo.height,
        basicInfo.region,
      );  
    }
    else {
      console.log("로그인 정보가 없습니다.");
    }

    
  }

  const contents = [
    // 닉네임 설정 페이지
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>닉네임 설정</Text>
      </View>
      <CustomTextInput placeholder="닉네임을 입력해주세요" onChangeText={handleNicknameOnChange}/>
    </>,

    // 성별 설정 페이지
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>성별</Text>
      </View>
      <View style={styles.genderButtonContainer}>
        <Pressable onPress={() => { handleSelectGender("MALE") }} style={{ flex: 1 }}>
          <View style={basicInfo.gender === "MALE" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
            <Text style={basicInfo.gender === "MALE" ? styles.selectedGenderButtonText : styles.genderButtonText }>남</Text>
          </View>
        </Pressable>
        <View style={styles.genderButtonSeparator}/>
        <Pressable onPress={() => { handleSelectGender("FEMALE") }} style={{ flex: 1 }}>
          <View style={basicInfo.gender === "FEMALE" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
            <Text style={basicInfo.gender === "FEMALE" ? styles.selectedGenderButtonText : styles.genderButtonText }>여</Text>
          </View>
        </Pressable>
      </View>
    </>,

    // 나이대 설정 페이지
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>나이대</Text>
      </View>
      <View>
        <View style={styles.ageButtonContainer}>
          <Pressable onPress={() => { handleSelectAge("TWENTIES") }} style={{ flex: 1 }}>
            <View style={basicInfo.age[0] === "TWENTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
              <Text style={basicInfo.age[0] === "TWENTIES" ? styles.selectedGenderButtonText : styles.genderButtonText }>20대</Text>
            </View>
          </Pressable>
          <View style={styles.ageButtonSeparator}/>
          <Pressable onPress={() => { handleSelectAge("THIRTIES") }} style={{ flex: 1 }}>
            <View style={basicInfo.age[0] === "THIRTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
              <Text style={basicInfo.age[0] === "THIRTIES" ? styles.selectedGenderButtonText : styles.genderButtonText }>30대</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.ageButtonSeparator}/>
        <View style={styles.ageButtonContainer}>
          <Pressable onPress={() => { handleSelectAge("FORTIES") }} style={{ flex: 1 }}>
            <View style={basicInfo.age[0] === "FORTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
              <Text style={basicInfo.age[0] === "FORTIES" ? styles.selectedGenderButtonText : styles.genderButtonText }>40대</Text>
            </View>
          </Pressable>
          <View style={styles.ageButtonSeparator}/>
          <Pressable onPress={() => { handleSelectAge("FIFTIES") }} style={{ flex: 1 }}>
            <View style={basicInfo.age[0] === "FIFTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
              <Text style={basicInfo.age[0] === "FIFTIES" ? styles.selectedGenderButtonText : styles.genderButtonText }>50대</Text>
            </View>
          </Pressable>
          <View style={styles.ageButtonSeparator}/>
          <Pressable onPress={() => { handleSelectAge("SIXTIES") }} style={{ flex: 1 }}>
            <View style={basicInfo.age[0] === "SIXTIES" ? styles.selectedGenderButtonStyle : styles.genderButtonStyle}>
              <Text style={basicInfo.age[0] === "SIXTIES" ? styles.selectedGenderButtonText : styles.genderButtonText }>60대</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={{ height: 52 }}/>
      <CustomSlider values={["초반", "중반", "후반"]} setValue={setAgeSliderValue}/>
    </>,

    // 키 설정 페이지
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>키</Text>
      </View>
      <CustomSlider values={["150대\n이하", "160대", "170대", "180대", "190대\n이상"]} setValue={setHeightSliderValue}/>
    </>,

    // 지역 설정 페이지
    <>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>지역</Text>
      </View>
      <View style={[styles.innerContainer, {flex: 0}]}>
        <View style={styles.tagContainer}>
          <View style={styles.primaryTag}>
            <Text style={styles.primaryTagText}>서울</Text>
          </View>
        </View>
      </View>
      <View style={{ borderColor: colors.gray3, borderTopWidth: 1, width: "100%", marginBottom: 12 }}/>
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={styles.tagContainer}>
            {Object.entries(region.SEOUL).map(([key, value]) => {
              if (key === "DEFAULT") return null;
              return <Pressable onPress={() => { handleSelectRegion(key) }} key={key}>
                <View key={key} style={basicInfo.region === key ? styles.selectedTag : styles.tag}>
                  <Text style={basicInfo.region === key ? styles.selectedTagText : styles.tagText}>{value}</Text>
                </View>
              </Pressable>}
            )}
          </View>
        </View>
      </ScrollView>
    </>,

    // 최종 확인 페이지
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
            {ageGroup[basicInfo.age[0] as keyof AgeGroup]} {ageDegree[basicInfo.age[1] as keyof AgeDegree]}
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
  ]

  useEffect(() => {
    console.log(basicInfo);
  }, [basicInfo])

  return <View style={{backgroundColor: "white", flex: 1, paddingHorizontal: 32}}>
    <Title onPress={handlePrevPage}>기본 정보</Title>
    <View style={styles.innerContainer}>
      <Card style={styles.card}>
        <IconText icon={{source: "chat-question", size: 18}} textStyle={styles.cardText}>기본 정보는 왜 필요한가요? 🤔</IconText>
      </Card>
      <View style={styles.textContainer}>
        <Text style={styles.text}>다른 사용자와 관계를 시작하기 전,{"\n"} 서로 최소한의 인적 사항을 참고하기 위함이에요.</Text>
      </View>
      {contents[pageIndex]}
    </View>
    <View style={{ marginBottom: 12 }}/>
    <CustomProgressBar progress={(pageIndex + 1) / 6}/>
    <View style={styles.bottomContainer}>
      <CustomButton style={isFormValid() ? styles.activatedButtonStyle : styles.disabledButtonStyle} onPress={handleNextPage}>완료</CustomButton>
    </View>
  </View>
}

export default BasicInfoPage;


const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
    height: 127,
  },
  card: {
    backgroundColor: colors.light_pink,
    width: 225,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
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
  activatedButtonStyle: {
    backgroundColor: colors.point,
    marginTop: 27,
  },
  disabledButtonStyle: {
    backgroundColor: colors.pastel_point,
    marginTop: 27,
  },
  genderButtonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    width: "100%",
    height: 80,
  },
  genderButtonStyle: {
    flex: 1,
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
  },
  selectedTag: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
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
