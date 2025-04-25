import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
const CustomLink = ({ children, to, className }) => {
    return (<Link className={"m-auto text-sky-600 cursor-pointer hover:underline" + (className ? (" " + className) : "")} to={to}>
        {children}
    </Link>)
}
export default CustomLink

export const CustomNavLink = ({ children, to, className }) => {
    return (<NavLink
        className={"text-slate-50 mr-[1em] cursor-pointer hover:opacity-50" + (className ? (" " + className) : "")}
        activeclassname={"underline"}
        to={to}>
        {children}
    </NavLink>)
}