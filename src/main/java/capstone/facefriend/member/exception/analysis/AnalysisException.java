package capstone.facefriend.member.exception.analysis;

import capstone.facefriend.common.exception.BaseException;
import capstone.facefriend.common.exception.ExceptionType;

public class AnalysisException extends BaseException {

    public AnalysisException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
