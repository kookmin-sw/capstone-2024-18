export interface Region {
  SEOUL: {
  DEFAULT: "",
    GANGNAM_SEOCHO_YANGJAE: string;
    JAMSIL_SONGPA_GANGDONG: "잠실·송파·강동",
    DONGJAK_GWANAK_SADANG: "동작·관악·사당",
    MAPO_SEODAEMUN_EUNPYANG: "마포·서대문·은평",
    JONGNO_JUNGGU_YONGSAN: "종로·중구·용산",
    NOWON_DOBONG_GANGBUK_SUNGBUK: "노원·도봉·강북·성북",
    GWANGJIN_SEONGDONG_JUNGRANG_DONGDAEMUN: "광진·성동·중랑·동대문",
    YEONGDEUNGPO_GURO_SINDORIM: "영등포·구로·신도림",
  }
}

export const region = {
  SEOUL: {
    DEFAULT: "",
    GANGNAM_SEOCHO_YANGJAE: "강남·서초·양재",
    JAMSIL_SONGPA_GANGDONG: "잠실·송파·강동",
    DONGJAK_GWANAK_SADANG: "동작·관악·사당",
    MAPO_SEODAEMUN_EUNPYANG: "마포·서대문·은평",
    JONGNO_JUNGGU_YONGSAN: "종로·중구·용산",
    NOWON_DOBONG_GANGBUK_SUNGBUK: "노원·도봉·강북·성북",
    GWANGJIN_SEONGDONG_JUNGRANG_DONGDAEMUN: "광진·성동·중랑·동대문",
    YEONGDEUNGPO_GURO_SINDORIM: "영등포·구로·신도림",
  },
}

export interface HeightGroup {
  DEFAULT: "",
  FIFTIES: "150cm 대",
  SIXTIES: "160cm 대",
  SEVENTIES: "170cm 대",
  EIGHTIES: "180cm 대",
  NINETIES: "190cm 대",
}

export const heightGroup = {
  DEFAULT: "",
  FIFTIES: "150대",
  SIXTIES: "160대",
  SEVENTIES: "170대",
  EIGHTIES: "180대",
  NINETIES: "190대",
}

export interface AgeDegree {
  DEFAULT: "",
  EARLY: "초반",
  MIDDLE: "중반",
  LATE: "후반",
}

export const ageDegree = {
  DEFAULT: "",
  EARLY: "초반",
  MIDDLE: "중반",
  LATE: "후반",
}

export interface AgeGroup {
  DEFAULT: "",
  TWENTIES:	"20대",
  THIRTIES:	"30대",
  FORTIES:	"40대",
  FIFTIES:	"50대",
  SIXTIES:	"60대",
}

export const ageGroup = {
  DEFAULT: "",
  TWENTIES:	"20대",
  THIRTIES:	"30대",
  FORTIES:	"40대",
  FIFTIES:	"50대",
  SIXTIES:	"60대",
}

export interface Gender {
  DEFAULT: string;
  MALE:	string;
  FEMALE:	string;
}

export const gender = {
  DEFAULT: "",
  MALE:	"남자",
  FEMALE:	"여자",
}