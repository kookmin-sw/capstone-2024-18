package capstone.facefriend.member.dto.faceInfo;

public record FaceInfoResponse(
        String originS3url,
        String generatedS3url
) {
}
