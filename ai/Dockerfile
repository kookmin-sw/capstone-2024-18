FROM lsh9034/ai-env
WORKDIR /root
RUN dos2unix .bashrc
CMD ["/bin/bash","-c", "source .bashrc && conda activate ai_env && ./run_script.sh && /bin/bash"]