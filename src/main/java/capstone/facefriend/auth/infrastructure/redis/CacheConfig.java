package capstone.facefriend.auth.infrastructure.redis;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import org.springframework.core.io.ResourceLoader;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CacheConfig {

//    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, ResourceLoader resourceLoader) {
//        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration
//                .defaultCacheConfig()
//                .disableCachingNullValues()
//                .serializeValuesWith(RedisSerializationContext.SerializationPair
//                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
//
//        Map<String, RedisCacheConfiguration> redisCacheConfigMap = new HashMap<>();
//
//
//
//    }
}
