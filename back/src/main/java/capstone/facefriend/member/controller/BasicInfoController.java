package capstone.facefriend.member.controller;

import capstone.facefriend.auth.support.AuthMember;
import capstone.facefriend.member.dto.basicInfo.BasicInfoRequest;
import capstone.facefriend.member.dto.basicInfo.BasicInfoResponse;
import capstone.facefriend.member.service.BasicInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BasicInfoController {

    private final BasicInfoService basicInfoService;

    @GetMapping("/basic-info")
    public ResponseEntity<BasicInfoResponse> getBasicInfo(
            @AuthMember Long memberId
    ) {
        return ResponseEntity.ok(basicInfoService.getBasicInfo(memberId));
    }

    @PutMapping("/basic-info")
    public ResponseEntity<BasicInfoResponse> putBasicInfo(
            @AuthMember Long memberId,
            @RequestBody BasicInfoRequest request
    ) {
        return ResponseEntity.ok(basicInfoService.putBasicInfo(memberId, request));
    }
}
