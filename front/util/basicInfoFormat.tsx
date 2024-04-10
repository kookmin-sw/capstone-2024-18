export interface Region {
  SEOUL: {
    GANGNAM_SEOCHO_YANGJAE: string;
    JAMSIL_SONGPA_GANGDONG: "잠실·송파·강동",
    DONGJAK_GWANAK_SADANG: "동작·관악·사당",
    MAPO_SEODAEMUN_EUNPYANG: "마포·서대문·은평",
    JONGNO_JUNGGU_YONGSAN: "종로·중구·용산",
    NOWON_DOBONG_GANGBUK_SUNGBUK: "노원·도봉·강북·성북",
    GWANGJIN_SEONGDONG_JUNGRANG_DONGDAEMUN: "광진·성동·중랑·동대문",
    YEONGDEUNGPO_GURO_SINDORIM: "영등포·구로·신도림",
    DEFAULT: "",
  }
}

export const region = {
  SEOUL: {
    GANGNAM_SEOCHO_YANGJAE: "강남·서초·양재",
    JAMSIL_SONGPA_GANGDONG: "잠실·송파·강동",
    DONGJAK_GWANAK_SADANG: "동작·관악·사당",
    MAPO_SEODAEMUN_EUNPYANG: "마포·서대문·은평",
    JONGNO_JUNGGU_YONGSAN: "종로·중구·용산",
    NOWON_DOBONG_GANGBUK_SUNGBUK: "노원·도봉·강북·성북",
    GWANGJIN_SEONGDONG_JUNGRANG_DONGDAEMUN: "광진·성동·중랑·동대문",
    YEONGDEUNGPO_GURO_SINDORIM: "영등포·구로·신도림",
    DEFAULT: "",
  },
}

export interface HeightGroup {
  FIFTIES: "150cm 대",
  SIXTIES: "160cm 대",
  SEVENTIES: "170cm 대",
  EIGHTIES: "180cm 대",
  NINETIES: "190cm 대",
  DEFAULT: "",
}

export const heightGroup = {
  FIFTIES: "150대",
  SIXTIES: "160대",
  SEVENTIES: "170대",
  EIGHTIES: "180대",
  NINETIES: "190대",
  DEFAULT: "",
}

export interface AgeDegree {
  EARLY: "초반",
  MIDDLE: "중반",
  LATE: "후반",
  DEFAULT: "",
}

export const ageDegree = {
  EARLY: "초반",
  MIDDLE: "중반",
  LATE: "후반",
  DEFAULT: "",
}

export interface AgeGroup {
  TWENTIES:	"20대",
  THIRTIES:	"30대",
  FORTIES:	"40대",
  FIFTIES:	"50대",
  SIXTIES:	"60대",
  DEFAULT: "",
}

export const ageGroup = {
  TWENTIES:	"20대",
  THIRTIES:	"30대",
  FORTIES:	"40대",
  FIFTIES:	"50대",
  SIXTIES:	"60대",
  DEFAULT: "",
}

export interface Gender {
  MALE:	string;
  FEMALE:	string;
  DEFAULT: string;
}

export const gender = {
  MALE:	"남자",
  FEMALE:	"여자",
  DEFAULT: "",
}