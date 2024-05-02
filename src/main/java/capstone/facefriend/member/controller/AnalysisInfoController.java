package capstone.facefriend.member.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.member.service.AnalysisInfoService;
import capstone.facefriend.member.service.dto.analysisInfo.AnalysisInfoFullResponse;
import capstone.facefriend.member.service.dto.analysisInfo.AnalysisInfoFullShortResponse;
import capstone.facefriend.member.service.dto.analysisInfo.AnalysisInfoShortResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AnalysisInfoController {

    private final AnalysisInfoService analysisInfoService;

    // 관상 분석할 때 사용
    @PutMapping("/analysis-info")
    public ResponseEntity<AnalysisInfoFullResponse> analyze(
            @RequestPart("origin") MultipartFile origin,
            @AuthMember Long memberId
    ) throws IOException {
        return ResponseEntity.ok(analysisInfoService.analyze(origin, memberId));
    }

    @GetMapping("/analysis-info")
    public ResponseEntity<AnalysisInfoFullShortResponse> getAnalysisInfo(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(analysisInfoService.getAnalysisInfoFullShort(memberId));
    }

    @GetMapping("/analysis-info/full")
    public ResponseEntity<AnalysisInfoFullResponse> getAnalysisInfoFull(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(analysisInfoService.getAnalysisInfoFull(memberId));
    }

    @GetMapping("/analysis-info/short")
    public ResponseEntity<AnalysisInfoShortResponse> getAnalysisInfoShort(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(analysisInfoService.getAnalysisInfoShort(memberId));
    }
}
