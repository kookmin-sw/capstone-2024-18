package capstone.facefriend.member.domain.faceInfo;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = {"id"}, callSuper = false)
@Entity
public class FaceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String originS3Url;

    @Column
    private String generatedS3url;

    public void setOriginS3Url(String originS3Url) {
        this.originS3Url = originS3Url;
    }

    public void setGeneratedS3Url(String generatedS3url) {
        this.generatedS3url = generatedS3url;
    }
}
