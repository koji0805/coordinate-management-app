const Header = ({ isLoggedIn, onLogout }) => {
    return (<>
        <header className="bg-sky-600 text-slate-50 p-[20px] text-xl ">
            {isLoggedIn && <button className="bg-slate-50 text-sky-600 float-right text-base p-[4px] rounded-md hover:bg-sky-100 cursor-pointer" onClick={onLogout}>ログアウト</button>}
            <h1>着物メモ</h1>
        </header>
    </>);
}
export default Header;