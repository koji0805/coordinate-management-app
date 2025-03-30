import { FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function ListItem({ item = {}, to, title, date }) {
    return (
        <li className="
            inline-block mr-[1em] mb-[.5em] w-[100%] 
            sm:w-[calc(50%_-_.5em)] sm:[&:nth-child(2n)]:mr-0
            md:w-[calc((100%_-_2em)_/_3)] md:[&:nth-child(3n)]:mr-0 md:[&:nth-child(2n)]:mr-[1em]
            " title={item.name}>
            <Link to={to}>
                <p className="p-[.5em] bg-slate-400 text-center text-slate-50">
                    <span className="text-[100px] inline-block">
                        <FaImage />
                    </span>
                </p>
                <p className="whitespace-nowrap text-ellipsis w-[100%] overflow-hidden">{title}</p>
                {date && <p>{date.split("T")[0]}</p>}
            </Link>
        </li>
    );
}