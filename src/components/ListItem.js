import { FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function ItemListItem({ item = {}, to, title, date }) {
    return (
        <li className="inline-block w-[300px] mr-[1em] mb-[.5em] [&:nth-child(3n)]:mr-0" title={item.name}>
            <Link to={to}>
                <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                    <span className="text-[100px] inline-block">
                        <FaImage />
                    </span>
                </p>
                <h3 className="whitespace-nowrap text-ellipsis w-[100%] overflow-hidden">{title}</h3>
                {date && <p>{date}</p>}
            </Link>
        </li>
    );
}