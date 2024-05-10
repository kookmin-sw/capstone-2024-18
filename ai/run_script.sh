gunicorn -w 2 --bind 0.0.0.0:5000 "face_generate:app" --daemon --enable-stdio-inheritance --log-level debug
gunicorn -w 1 --bind 0.0.0.0:5001 "face_analyze:app" --daemon