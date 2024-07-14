package capstone.facefriend.member.dto.analysisInfo;

import java.util.List;
import java.util.Map;

public record AnalysisInfoFullShortResponse(
        Map<String, String> analysisFull,
        List<String> analysisShort
) {

}
