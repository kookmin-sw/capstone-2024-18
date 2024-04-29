package capstone.facefriend.member.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBasicInfo is a Querydsl query type for BasicInfo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBasicInfo extends EntityPathBase<BasicInfo> {

    private static final long serialVersionUID = 2102099022L;

    public static final QBasicInfo basicInfo = new QBasicInfo("basicInfo");

    public final EnumPath<BasicInfo.AgeDegree> ageDegree = createEnum("ageDegree", BasicInfo.AgeDegree.class);

    public final EnumPath<BasicInfo.AgeGroup> ageGroup = createEnum("ageGroup", BasicInfo.AgeGroup.class);

    public final EnumPath<BasicInfo.Gender> gender = createEnum("gender", BasicInfo.Gender.class);

    public final EnumPath<BasicInfo.HeightGroup> heightGroup = createEnum("heightGroup", BasicInfo.HeightGroup.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath nickname = createString("nickname");

    public final EnumPath<BasicInfo.Region> region = createEnum("region", BasicInfo.Region.class);

    public QBasicInfo(String variable) {
        super(BasicInfo.class, forVariable(variable));
    }

    public QBasicInfo(Path<? extends BasicInfo> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBasicInfo(PathMetadata metadata) {
        super(BasicInfo.class, metadata);
    }

}

