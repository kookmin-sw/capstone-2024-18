package capstone.facefriend.member.domain.basicInfo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = {"id"}, callSuper = false)
@Entity
public class BasicInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgeGroup ageGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgeDegree ageDegree;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HeightGroup heightGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Region region;

    public enum Gender {
        DEFAULT(""),
        MALE("남자"),
        FEMALE("여자");

        private final String value;

        Gender(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum AgeGroup {
        DEFAULT(""),
        TWENTIES("20 대"),
        THIRTIES("30 대"),
        FORTIES("40 대"),
        FIFTIES("50 대"),
        SIXTIES("60 대");

        private final String value;

        AgeGroup(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum AgeDegree {
        DEFAULT(""),
        EARLY("초반"),
        MIDDLE("중반"),
        LATE("후반");

        private final String value;

        AgeDegree(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum HeightGroup {
        DEFAULT(""),
        FIFTIES("150cm 대 이하"),
        SIXTIES("160cm 대"),
        SEVENTIES("170cm 대"),
        EIGHTIES("180cm 대"),
        NINETIES("190cm 대 이상");

        private final String value;

        HeightGroup(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum Region {
        DEFAULT(""),
        GANGNAM_SEOCHO_YANGJAE("강남, 서초, 양재"),
        JAMSIL_SONGPA_GANGDONG("잠실, 송파, 강동"),
        DONGJAK_GWANAK_SADANG("동작, 관악, 사당"),
        MAPO_SEODAEMUN_EUNPYANG("마포, 서대문, 은평"),
        JONGNO_JUNGGU_YONGSAN("종로, 중구, 용산"),
        NOWON_DOBONG_GANGBUK_SUNGBUK("노원, 도봉, 강북, 성북"),
        GWANGJIN_SEONGDONG_JUNGRANG_DONGDAEMUN("광진, 성동, 중랑, 동대문"),
        YEONGDEUNGPO_GURO_SINDORIM("영등포, 구로, 신도림");

        private final String value;

        Region(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
