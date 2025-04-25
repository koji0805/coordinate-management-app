#!/bin/bash

# バックエンドの起動
cd backend
uvicorn app.main:app --reload --port 8000 &

# フロントエンドの起動
cd ../frontend
npm start 