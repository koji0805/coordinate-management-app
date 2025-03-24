import { FaQuestionCircle } from "react-icons/fa";

const HintIcon = ({ title }) => {
    return (
        <span className="inline-block align-text-top text-[1.1em]" title={title}><FaQuestionCircle /></span>
    )
}

export default HintIcon;