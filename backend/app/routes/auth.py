from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.schemas import UserCreate, UserLogin, UserUpdate
from app.models import User
from app.database import get_db
from app.auth_utils import verify_password, get_password_hash, create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from datetime import timedelta
from jose import jwt, JWTError  # JWTトークンの生成と検証
from jose.exceptions import ExpiredSignatureError

# 認証ルーターを作成
router = APIRouter(prefix="/auth", tags=["auth"])

# トークンを取得するためのエンドポイントのURL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# 各トークンの期限
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# ユーザー登録エンドポイント
@router.post("/signup",summary="ユーザー登録",)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """
    新しいユーザーを登録する
    """
    try:
        # メールアドレスが既に存在するか確認
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="このメールアドレスは登録されています")

        # パスワードをハッシュ化して新しいユーザーを作成
        hashed_password = get_password_hash(user.password)
        new_user = User(username=user.username, email=user.email, hashed_password=hashed_password )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "アカウントが作成されました"}

    except ValueError as e:
        # バリデーションエラーを HTTPException に変換
        raise HTTPException(status_code=422, detail=str(e))

# ログインエンドポイント
@router.post("/login",summary="ログイン",)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    ログインしてアクセストークンを取得する
    """
    # ユーザーをデータベースから取得
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="無効です")

    # JWTトークンを生成して返す
    access_token = create_access_token(data={"sub": str(db_user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)}, expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    return {
        "access_token": access_token, 
        "username": db_user.username, 
        "refresh_token":refresh_token,
        "token_type": "bearer"
    }

# リフレッシュトークンを受け取って新しいアクセストークンを返す
@router.post('/refresh', summary="リフレッシュトークンで新しいアクセストークンを取得")
def refresh(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="ユーザー情報が含まれていません")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="リフレッシュトークンの有効期限が切れています")
    except JWTError as e:
        raise HTTPException(status_code=401, detail="リフレッシュトークンが無効です")
    except Exception as e:
        raise HTTPException(status_code=500, detail="トークン再発行中に内部エラーが発生しました")
    
    # ユーザーをデータベースから取得
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="ユーザーが存在しません")

    # JWTトークンを生成して返す
    new_access_token = create_access_token(data={"sub": str(db_user.id)}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

# 現在のユーザーを取得するヘルパー関数
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    トークンからユーザー情報を取得する
    """
    from app.auth_utils import decode_access_token
    try:
        payload = decode_access_token(token)
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="リフレッシュトークンの有効期限が切れています")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="無効なトークンです")
    return user

# 現在のユーザーを取得する
@router.get("/me",summary="現在のユーザーを取得",)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    トークンから現在ログインしているユーザーの情報を取得する
    """
    return {
        "username": current_user.username,
        "email": current_user.email,
        "id": current_user.id
    }

# ユーザー情報を変更する
@router.put("/me",summary="ユーザー情報を変更する",)
def update_current_user(update_user: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    ユーザー情報を変更する
    """
    # ユーザーをデータベースから取得
    db_user = db.query(User).filter(User.email == current_user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="ユーザー情報が見つかりません")
    
    update_data = update_user.dict(exclude_unset=True)

    # パスワードが送られてきたらハッシュ化して保存
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)

    # 更新するフィールドを設定
    for key, value in update_user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()  # 保存
    db.refresh(db_user)  # データをリロード
    return {"message": "ユーザー情報が更新されました"}