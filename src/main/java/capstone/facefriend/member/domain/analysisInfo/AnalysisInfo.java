package capstone.facefriend.member.domain.analysisInfo;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = {"id"}, callSuper = false)
@Entity
public class AnalysisInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ANALYSIS_INFO_ID")
    private Long id;

    private Integer faceShapeIdNum;

    @ElementCollection
    @CollectionTable(name = "ANALYSIS_FULL", joinColumns = @JoinColumn(name = "ANALYSIS_INFO_ID"))
    private Map<String, String> analysisInfoFull = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "ANALYSIS_SHORT", joinColumns = @JoinColumn(name = "ANALYSIS_INFO_ID"))
    private List<String> analysisInfoShort = new ArrayList<>();
}

