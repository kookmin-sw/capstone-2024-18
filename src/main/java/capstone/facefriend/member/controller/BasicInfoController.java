package capstone.facefriend.member.controller;


import capstone.facefriend.auth.controller.support.AuthMember;
import capstone.facefriend.member.service.BasicInfoService;
import capstone.facefriend.member.service.dto.BasicInfoRequest;
import capstone.facefriend.member.service.dto.BasicInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class BasicInfoController {

    private final BasicInfoService basicInfoService;

    @PostMapping("/basic-info")
    public ResponseEntity<BasicInfoResponse> setBasicInfo(
            @AuthMember Long memberId,
            @RequestBody BasicInfoRequest request
    ) {
        return ResponseEntity.ok(basicInfoService.setBasicInfo(memberId, request));
    }

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
