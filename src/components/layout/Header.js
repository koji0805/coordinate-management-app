import { CustomNavLink } from "../common/CustomLink";
export const H2 = ({ children, className }) => {
    return (<h3 className={`text-[24px] font-bold mb-[16px] ${className}`}>{children}</h3>)
}

export const H3 = ({ children }) => {
    return (<h3 className="text-[20px] font-bold mt-[16px]">{children}</h3>)
}
const Header = ({ isLoggedIn, onLogout }) => {

    const ItemsForUser = () => {
        return (<>
            <CustomNavLink to="/home">ホーム</ CustomNavLink>
            <CustomNavLink to="/setting">設定</ CustomNavLink>
            <button className="bg-slate-50 text-sky-600 p-[4px] rounded-md hover:bg-sky-100 cursor-pointer" onClick={onLogout}>ログアウト</button>
        </>)
    }

    const ItemsForGuest = () => {
        return (<>
            <CustomNavLink to="/signup">新規登録</ CustomNavLink>
            <CustomNavLink to="/login">ログイン</ CustomNavLink>
        </>)
    }
    return (<>
        <header className="bg-sky-600 text-slate-50 p-[20px] text-xl ">
            <div className="float-right text-base">
                {isLoggedIn ? <ItemsForUser /> : <ItemsForGuest />}
            </div>
            <h1>着物メモ</h1>
        </header>
    </>);
}
export default Header;