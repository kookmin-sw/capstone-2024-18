package capstone.facefriend.chat.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@EnableAsync
@Configuration
public class ChatAsyncConfig {

    @Bean("chatAsyncExecutor")
    public Executor chatAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setThreadNamePrefix("chat-");
        executor.initialize();
        return executor;
    }
}
