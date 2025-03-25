const Button = ({ children }) => {
    return (
        <button className="w-[100%] py-[8px] bg-sky-600 hover:opacity-50 text-slate-50 rounded-md cursor-pointer mb-[16px]">{children}</button>
    )
}

export default Button;