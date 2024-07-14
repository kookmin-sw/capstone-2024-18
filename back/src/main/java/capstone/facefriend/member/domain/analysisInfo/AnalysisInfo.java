package capstone.facefriend.member.domain.analysisInfo;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
public class AnalysisInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ANALYSIS_INFO_ID")
    private Long id;

    @Column
    private Integer faceShapeIdNum;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "ANALYSIS_INFO_FULL", joinColumns = @JoinColumn(name = "ANALYSIS_INFO_ID"))
    private Map<String, String> analysisFull = new HashMap<>();

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "ANALYSIS_INFO_SHORT", joinColumns = @JoinColumn(name = "ANALYSIS_INFO_ID"))
    private List<String> analysisShort = new ArrayList<>();
}

