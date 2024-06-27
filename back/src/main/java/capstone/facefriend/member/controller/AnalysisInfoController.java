package capstone.facefriend.member.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.member.exception.analysis.AnalysisInfoException;
import capstone.facefriend.member.exception.analysis.AnalysisInfoExceptionType;
import capstone.facefriend.member.exception.faceInfo.FaceInfoException;
import capstone.facefriend.member.service.AnalysisInfoRequestor;
import capstone.facefriend.member.service.AnalysisInfoService;
import capstone.facefriend.member.dto.analysisInfo.AnalysisInfoFullResponse;
import capstone.facefriend.member.dto.analysisInfo.AnalysisInfoFullShortResponse;
import capstone.facefriend.member.dto.analysisInfo.AnalysisInfoShortResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static capstone.facefriend.member.exception.analysis.AnalysisInfoExceptionType.*;
import static capstone.facefriend.member.exception.faceInfo.FaceInfoExceptionType.FAIL_TO_GENERATE;
import static capstone.facefriend.member.service.AnalysisInfoService.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AnalysisInfoController {

    private final AnalysisInfoService analysisInfoService;
    private final AnalysisInfoRequestor analysisInfoRequestor;

    @PutMapping("/analysis-info")
    public ResponseEntity<AnalysisInfoFullShortResponse> analyze(
            @RequestPart("origin") MultipartFile origin,
            @AuthMember Long memberId
    ) {
        CompletableFuture<AnalysisInfoTotal> futureAnalysisInfoTotal = CompletableFuture
                .supplyAsync(() -> analysisInfoRequestor.analyze(origin, memberId));

        AnalysisInfoTotal total = fetchAnalysisInfoTotal(futureAnalysisInfoTotal);

        return ResponseEntity.ok(analysisInfoService.bindAnalysisInfoTotal(total, memberId));
    }

    @GetMapping("/analysis-info/full-short")
    public ResponseEntity<AnalysisInfoFullShortResponse> getAnalysisInfoFullShort(
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

    private AnalysisInfoTotal fetchAnalysisInfoTotal(CompletableFuture<AnalysisInfoTotal> futureAnalysisInfoTotal) {
        AnalysisInfoTotal total;

        try {
            total = futureAnalysisInfoTotal.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new AnalysisInfoException(FAIL_TO_ANALYSIS);
        }

        return total;
    }
}
