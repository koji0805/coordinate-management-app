const ErrorText = ({ children, className }) => {
    return (
        <p className={className + " text-red-500"}>{children}</p>
    )
}
export default ErrorText;