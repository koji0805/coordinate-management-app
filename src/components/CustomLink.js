import { Link } from "react-router-dom";
const CustomLink = ({ children, to }) => {
    console.log()
    return (<Link className="m-auto text-sky-600 cursor-pointer hover:underline" to={to}>
        {children}
    </Link>)
}
export default CustomLink