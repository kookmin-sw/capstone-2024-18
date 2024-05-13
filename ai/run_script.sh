gunicorn -w 3 --bind 0.0.0.0:5000 "face_generate:app" --daemon --enable-stdio-inheritance --log-level debug --timeout 300
gunicorn -w 1 --bind 0.0.0.0:5001 "face_analyze:app" --daemon --timeout 300