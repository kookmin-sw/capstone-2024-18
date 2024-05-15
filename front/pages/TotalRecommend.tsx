import { Modal, View, Text, Pressable, StyleSheet, useWindowDimensions, ScrollView, FlatList, TouchableOpacity, Image, BackHandler } from "react-native";
import { colors } from "../assets/colors";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { useContext, useEffect, useState } from "react";
import { IconButton } from "react-native-paper";
import { getCategoryUser, getGoodCombi, isResumesResponse, resumesResponse, sendCode, verifyCode } from "../util/auth";
import HeaderBar from "../components/HeaderBar";
import { AuthContext } from "../store/auth-context";
import { useRoute } from "@react-navigation/native";
import CustomBackHandler from "../components/CustomBackHandler";

const TotalRecommend = ({navigation}: any) => {
  interface Content {
    resumeId: number;
    thumbnailS3url: string
  }
  interface Faces {
    content: Content[], 
    last: boolean
  }

  const route = useRoute();
  const type = (route.params as { type: string })?.type;

  const getResumesNum = 20;
  const [data, setData] = useState<Faces>({
    content: [],
    last: false
  });

  const {width} = useWindowDimensions();

  // auth를 위한 method
  const authCtx = useContext(AuthContext);

  const tryGetResumes = async () => {
    if (authCtx.accessToken) {
      var response:any;
      if (type === "FIT") {
        response = await getGoodCombi(
          authCtx.accessToken, Math.floor(data.content.length/getResumesNum), getResumesNum
        )
      } else {
        response = await getCategoryUser(
          authCtx.accessToken, Math.floor(data.content.length/getResumesNum), getResumesNum, type
        )
      }
      
      if (isResumesResponse(response)) {
        setData((prev) => ({
          ...prev,
          content: [...prev.content, ...response.content], 
          last: response.last
        }));
      }
    }
  };

  const renderCardItem = ({item}: {item: Content}) => {{
    return (
      <TouchableOpacity key={item.resumeId} style={{margin: 10, borderWidth: 1, borderRadius: 6}} onPress={() => navigation.navigate("OtherSelfProduce", {resumeId: item.resumeId})}>
        <Image source={{uri: item.thumbnailS3url}} width={(width-104) / 2} height={(width-104) / 2}/>
      </TouchableOpacity>);
  }}

  const fetchNewData = async () => {
    if (data.last) return;

    await tryGetResumes();
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderBar onPress={navigation.goBack}>상세보기</HeaderBar>
      <CustomBackHandler onBack={navigation.goBack}/>
      <FlatList 
        data={data.content} numColumns={2}
        renderItem={renderCardItem}
        style={{flex: 1, marginBottom: 30, backgroundColor: colors.white}}
        contentContainerStyle={{alignItems: 'center', paddingBottom: 26, paddingHorizontal: 16}}
        onEndReached={() => {fetchNewData();}}/>
    </View>
  )
}

export default TotalRecommend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32, 
    backgroundColor: colors.white
  },
  title: {
    color: colors.gray7,
    fontSize: 24,
    fontFamily: "Pretendard-SemiBold",
    alignSelf: "center",
    marginBottom: 50,
  },
  textContainer: {
    flexDirection: "row", 
  },
  inputLabel: {
    fontSize: 14, 
    color: colors.point, 
    letterSpacing: -14 * 0.04,
    fontFamily: "Pretendard-SemiBold",
  },
  inputLabelStar: {
    fontSize: 16, 
    color: colors.gray6,
    fontFamily: "Pretendard-Regular",
  },
  sectionContainer: {
    borderBottomColor: colors.gray3,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 30,
    paddingBottom: 12,
    flex: 1,
  },
  pointButton: {
    backgroundColor: colors.point, 
    height: 50, 
    borderRadius: 10, 
    justifyContent: "center", 
    marginTop: 21,
    shadowColor: colors.gray4
  },
  pointButtonText: {
    color: colors.white, 
    fontWeight: "400", 
    fontSize: 18, 
    textAlign: "center",
    letterSpacing: -18 * 0.02, 
  },
  grayButtonContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems:"center",
  },
  grayButton: {
    backgroundColor: colors.gray6, 
    width: 80, 
    height: 30, 
    borderRadius: 6, 
    justifyContent: "center",
    padding: 0,
    flex: 0,
  },
  grayButtonText: {
    color: colors.white, 
    fontSize: 12, 
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    letterSpacing: -12 * 0.02,
  },
  bottomContainer: {
    alignItems: "center",
    marginBottom: 46,
    paddingHorizontal: 8,
  },
})