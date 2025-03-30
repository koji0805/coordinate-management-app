const Button = ({ children, ...props }) => {
    return (
        <button className="w-[100%] py-[8px] bg-sky-600 hover:opacity-50 text-slate-50 rounded-md cursor-pointer mb-[16px]" {...props}>{children}</button>
    )
}
export default Button;

export const WhiteButton = ({ children, className, ...props }) => {
    return (
        <button className={"w-[100%] py-[8px] text-sky-600 hover:opacity-50 border border-solid rounded-md cursor-pointer mb-[16px] " + (className ? className : "")} {...props}> {children}</button>
    )
}

export const GrayButton = ({ children, ...props }) => {
    return (
        <button className="w-[100%] py-[8px] hover:opacity-50 text-slate-400 border border-solid border-slate-400 rounded-md cursor-pointer mb-[16px]" {...props}>{children}</button>
    )
}

export const SmallWhiteButton = ({ children, className, ...props }) => {
    return (
        <button className={"py-[4px] px-[8px] hover:opacity-50 border border-solid border-sky-600 rounded-md cursor-pointer mb-[8px] max-w-[10em] overflow-hidden text-ellipsis whitespace-nowrap inline-block " + (className ? (className) : "")} {...props}> {children}</button >
    )
}

export const SmallButton = ({ children, className, ...props }) => {
    return (
        <button className={"py-[4px] px-[8px] hover:opacity-50 border border-solid text-slate-50 bg-sky-600 rounded-md cursor-pointer mb-[8px] max-w-[10em] overflow-hidden text-ellipsis whitespace-nowrap inline-block " + (className ? (className) : "")} {...props}> {children}</ button>
    )
}