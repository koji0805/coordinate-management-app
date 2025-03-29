import { FaQuestionCircle } from "react-icons/fa";

export const HintIcon = ({ title }) => {
    return (
        <span className="inline-block align-text-top text-[1.1em]" title={title}><FaQuestionCircle /></span>
    )
}