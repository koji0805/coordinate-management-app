import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SmallWhiteButton, SmallButton } from "../common/Button";

export const CustomForm = ({ children, onSubmit, className }) => {
    return (<form onSubmit={onSubmit} className={"max-w-[400px] m-auto mt-[40px] p-[8px] " + (className ? className : "")}>
        {children}
    </form>)
}

export const InputText = ({ value, placeholder, name, InputType, onChange, required, minlength }) => {
    // パスワード表示制御
    const [isRevealPassword, setIsRevealPassword] = useState(false);
    const isPassword = (InputType === "password");
    const [inputType, setInputType] = useState(InputType ? InputType : "text");
    const togglePassword = () => {
        setIsRevealPassword((prevState) => !prevState);
        setInputType(isRevealPassword ? 'password' : 'text')
    }
    // {...(isPassword ? { pattern: "[a-zA-Z0-9!-/:-@[-`{-~]*" } : {})}
    return (<div className={isPassword ? "relative" : ""}>
        <input type={inputType} value={value && value} placeholder={placeholder} name={name && name} onChange={onChange} required={required ? true : false} className={(isPassword ? "pr-[2em] " : "") + "w-[100%] mb-[28px] p-[8px] border-slate-200 border-[1px] border-solid placeholder:text-slate-400"} {...(isPassword ? { pattern: "[a-zA-Z0-9!-/:-@[-`{-~]*" } : {})} {...minlength ? minlength = { minlength } : ""} />
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

export const RadioButton = ({ text, name, value, checked, onChange, children, btnCls }) => {

    const handleClick = (e) => {
        // イベントを明示的に作成
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
            value: {
                name,
                value: value
            }
        });

        if (onChange) {
            onChange(event);
        }
    }

    const ColorMark = () => {
        const bgColor = "bg-" + value

        return (
            <p className={"w-[1em] h-[1em] rounded-[50%] absolute left-[8px] top-[50%] translate-y-[-50%] " + bgColor + (value === "white" ? " border-slate-200 border-[2px] border-solid" : "")}></p>
        )
    }
    return (
        <>
            <label className="mr-[.5em] cursor-pointer " onClick={handleClick}>
                <input
                    type="radio"
                    name={name}
                    value={value}
                    className={"hidden"}
                    checked={checked}
                    onChange={() => { }} // 空のonChangeハンドラ
                />
                {checked ?
                    <SmallButton className={btnCls + (name === "color" ? " relative pl-[calc(1em_+_12px)]" : "")} type="button">
                        {name === "color" && <ColorMark color={value} />}
                        {text}
                    </SmallButton>
                    :
                    <SmallWhiteButton className={btnCls + (name === "color" ? " relative pl-[calc(1em_+_12px)]" : "")} type="button">
                        {name === "color" && <ColorMark color={value} />}
                        {text}
                    </SmallWhiteButton>
                }
            </label>
        </>
    );
}

export const Textarea = ({ value, placeholder, onChange }) => {
    return (<textarea value={value} className="w-[100%] mb-[28px] p-[8px] border-slate-200 border-[1px] border-solid" placeholder={placeholder} onChange={onChange}></textarea>)
}