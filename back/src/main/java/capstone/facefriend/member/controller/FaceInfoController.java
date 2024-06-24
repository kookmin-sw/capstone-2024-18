package capstone.facefriend.member.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.dto.faceInfo.FaceInfoResponse;
import capstone.facefriend.member.exception.faceInfo.FaceInfoException;
import capstone.facefriend.member.service.FaceInfoRequestor;
import capstone.facefriend.member.service.FaceInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static capstone.facefriend.member.exception.faceInfo.FaceInfoExceptionType.FAIL_TO_GENERATE;

@Slf4j
@RestController
@RequiredArgsConstructor
public class FaceInfoController {

    private final FaceInfoService faceInfoService;
    private final BucketService bucketService;
    private final FaceInfoRequestor faceInfoRequestor;

    @GetMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> getOriginAndGenerated(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.getOriginAndGenerated(memberId));
    }

    @PutMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> updateOriginAndGenerated(
            @RequestPart("origin") MultipartFile origin,
            @RequestParam("styleId") Integer styleId,
            @AuthMember Long memberId
    ) {
        CompletableFuture<List<String>> futureS3Urls = CompletableFuture
                .supplyAsync(() -> faceInfoRequestor.generate(origin, styleId, memberId))
                .thenApply(generated -> bucketService.updateOriginAndGenerated(origin, generated, memberId));

        List<String> s3Urls = null;
        try {
            s3Urls = futureS3Urls.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new FaceInfoException(FAIL_TO_GENERATE);
        }

        return ResponseEntity.ok(faceInfoService.updateOriginAndGenerated(s3Urls, memberId));
    }

    @DeleteMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> deleteOriginAndGenerated(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.deleteOriginAndGenerated(memberId));
    }
}
