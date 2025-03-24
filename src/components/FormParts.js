import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const CustomForm = ({ children, onSubmit }) => {
    return (<form onSubmit={onSubmit} className="max-w-[400px] m-auto mt-[40px] p-[8px]">
        {children}
    </form>)
}

export const InputText = ({ value, placeholder, name, InputType, onChange, required }) => {
    // パスワード表示制御
    const [isRevealPassword, setIsRevealPassword] = useState(false);
    const isPassword = (InputType === "password");
    const [inputType, setInputType] = useState(InputType ? InputType : "text");
    const togglePassword = () => {
        setIsRevealPassword((prevState) => !prevState);
        setInputType(isRevealPassword ? 'password' : 'text')
    }
    return (<div className={isPassword ? "relative" : ""}>
        <input type={inputType} value={value && value} placeholder={placeholder} name={name && name} onChange={onChange} required={required ? true : false} className={(isPassword ? "pr-[2em] " : "") + "w-[100%] mb-[28px] p-[8px] border-slate-200 border-[1px] border-solid"} pattern={isPassword ? ("[a-zA-Z0-9!-/:-@[-`{-~]*") : ""} />
        {isPassword && < span
            onClick={togglePassword}
            role="presentation"
            className="absolute top-[.75em] right-[8px]"
        >
            {isRevealPassword ? (
                <FaEye />
            ) : (
                <FaEyeSlash />
            )}
        </span>}
    </div >)
};