package capstone.facefriend.member.service.deserializer;

import capstone.facefriend.member.exception.analysis.AnalysisException;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static capstone.facefriend.member.exception.analysis.AnalysisExceptionType.FAIL_TO_DESERIALIZE_ANALYSIS;
import static com.fasterxml.jackson.core.JsonToken.START_ARRAY;
import static com.fasterxml.jackson.core.JsonToken.VALUE_STRING;


public class StringListDeserializer extends JsonDeserializer<List<String>> {

    @Override
    public List<String> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        JsonToken jt = p.getCurrentToken();
        if (jt == START_ARRAY) {
            return p.readValueAs(List.class);
        } else if (jt == VALUE_STRING) {
            return Arrays.asList(p.getValueAsString());
        }
        throw new AnalysisException(FAIL_TO_DESERIALIZE_ANALYSIS);
    }
}
