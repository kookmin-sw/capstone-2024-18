package capstone.facefriend.member.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QFaceInfo is a Querydsl query type for FaceInfo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFaceInfo extends EntityPathBase<FaceInfo> {

    private static final long serialVersionUID = 896110617L;

    public static final QFaceInfo faceInfo = new QFaceInfo("faceInfo");

    public final StringPath generatedS3url = createString("generatedS3url");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath originS3Url = createString("originS3Url");

    public QFaceInfo(String variable) {
        super(FaceInfo.class, forVariable(variable));
    }

    public QFaceInfo(Path<? extends FaceInfo> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFaceInfo(PathMetadata metadata) {
        super(FaceInfo.class, metadata);
    }

}

