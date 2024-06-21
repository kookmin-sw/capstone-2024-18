package capstone.facefriend.member.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.common.aop.TimeTrace;
import capstone.facefriend.member.service.FaceInfoService;
import capstone.facefriend.member.dto.faceInfo.FaceInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequiredArgsConstructor
public class FaceInfoController {

    private final FaceInfoService faceInfoService;

    @GetMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> get(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.getOriginAndGenerated(memberId));
    }

    @PutMapping("/face-info")
    @TimeTrace
    public DeferredResult<ResponseEntity<FaceInfoResponse>> updateOriginAndGenerated(
            @RequestPart("origin")MultipartFile origin,
            @RequestParam("styleId") Integer styleId,
            @AuthMember Long memberId
    ) {
        DeferredResult<ResponseEntity<FaceInfoResponse>> deferredResult = new DeferredResult<>();

        CompletableFuture
                .supplyAsync(() -> faceInfoService.updateOriginAndGenerated(origin, styleId, memberId))
                .thenAccept(result -> deferredResult.setResult(ResponseEntity.ok(result)));

        return deferredResult;
    }

    @DeleteMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> deleteOriginAndGenerated(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.deleteOriginAndGenerated(memberId));
    }
}
