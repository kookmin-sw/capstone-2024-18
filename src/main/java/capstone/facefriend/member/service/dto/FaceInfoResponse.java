package capstone.facefriend.member.service.dto;

public record FaceInfoResponse(
    String originS3Url,
    String generatedS3Url
) {
}
