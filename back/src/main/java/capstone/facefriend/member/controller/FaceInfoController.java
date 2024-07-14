package capstone.facefriend.member.controller;

import static capstone.facefriend.member.exception.faceInfo.FaceInfoExceptionType.FAIL_TO_GENERATE;

import capstone.facefriend.auth.support.AuthMember;
import capstone.facefriend.bucket.BucketService;
import capstone.facefriend.member.dto.faceInfo.FaceInfoResponse;
import capstone.facefriend.member.exception.faceInfo.FaceInfoException;
import capstone.facefriend.member.service.FaceInfoRequestor;
import capstone.facefriend.member.service.FaceInfoService;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class FaceInfoController {

    private final FaceInfoService faceInfoService;
    private final BucketService bucketService;
    private final FaceInfoRequestor faceInfoRequestor;

    @PutMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> putOriginAndGenerated(
            @RequestPart("origin") MultipartFile origin,
            @RequestParam("styleId") Integer styleId,
            @AuthMember Long memberId
    ) {
        CompletableFuture<List<String>> futureS3Urls = CompletableFuture
                .supplyAsync(() -> faceInfoRequestor.generate(origin, styleId, memberId))
                .thenApply(generated -> bucketService.putOriginAndGenerated(origin, generated, memberId));

        return ResponseEntity.ok(faceInfoService.putOriginAndGenerated(fetchS3Urls(futureS3Urls), memberId));
    }

    @GetMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> getOriginAndGenerated(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.getOriginAndGenerated(memberId));
    }

    @DeleteMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> deleteOriginAndGenerated(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.deleteOriginAndGenerated(memberId));
    }

    private List<String> fetchS3Urls(CompletableFuture<List<String>> futureS3Urls) {
        List<String> s3Urls;
        try {
            s3Urls = futureS3Urls.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new FaceInfoException(FAIL_TO_GENERATE);
        }
        return s3Urls;
    }
}
