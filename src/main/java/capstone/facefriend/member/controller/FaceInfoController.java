package capstone.facefriend.member.controller;

import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.member.service.FaceInfoService;
import capstone.facefriend.member.service.dto.faceInfo.FaceInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    public ResponseEntity<FaceInfoResponse> update(
            @RequestPart("origin")MultipartFile origin,
            @RequestParam("styleId") Integer styleId,
            @AuthMember Long memberId
    ) throws IOException {
        return ResponseEntity.ok(faceInfoService.updateOrigin(origin, styleId, memberId));
    }

    @DeleteMapping("/face-info")
    public ResponseEntity<FaceInfoResponse> delete(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(faceInfoService.deleteOriginAndGenerated(memberId));
    }
}
