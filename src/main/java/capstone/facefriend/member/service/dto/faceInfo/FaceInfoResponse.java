package capstone.facefriend.member.service.dto.faceInfo;

public record FaceInfoResponse(
        String originS3url,
        String generatedS3url
) {
}
