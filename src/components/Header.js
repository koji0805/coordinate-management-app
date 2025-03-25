import { CustomNavLink } from "./CustomLink";
import { NavLink } from "react-router-dom";
const Header = ({ isLoggedIn, onLogout }) => {

    const ItemsForUser = () => {
        return (<>
            <div className="float-right text-base">
                <CustomNavLink to="/home">ホーム</ CustomNavLink>
                <CustomNavLink to="/mypage">マイページ</ CustomNavLink>
                <button className="bg-slate-50 text-sky-600 p-[4px] rounded-md hover:bg-sky-100 cursor-pointer" onClick={onLogout}>ログアウト</button>
            </div>
        </>)
    }
    return (<>
        <header className="bg-sky-600 text-slate-50 p-[20px] text-xl ">
            {isLoggedIn && <ItemsForUser />}
            <h1>着物メモ</h1>
        </header>
    </>);
}
export default Header;