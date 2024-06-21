package capstone.facefriend.bucket;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class BucketException extends BaseException {

    public BucketException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
