# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth, items, coordinates, coordinate_items, images
from app.database import Base, engine

# データベースの初期化
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS の設定
origins = [
    "http://localhost:3000",  # React開発サーバー
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# デバッグ用のエンドポイント
@app.get("/debug-test")
async def debug_test():
    # ここでブレークポイントをテストできます
    test_var = "デバッグテスト"
    return {"message": test_var}

# ルーターを追加
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(coordinates.router)
app.include_router(coordinate_items.router)
app.include_router(images.router)

# # 静的ファイル（画像など）の公開設定
app.mount("/images", StaticFiles(directory="upload"), name="images")

if __name__ == "__main__":
    import uvicorn
    # デバッグモードで実行する場合の設定
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)