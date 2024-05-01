package capstone.facefriend.member.service.dto.faceInfo;

public record FaceInfoResponse(
        String originS3Url,
        String generatedS3Url
) {
}
