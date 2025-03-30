import { IoCloseSharp } from "react-icons/io5";
import Button, { WhiteButton } from "./Button";
export default function Modal({ children, className, containerClass, header, isOpen, onClose, footerPrimaryBtn, footerSecondaryBtn, primaryBtnFunc }) {
    return (
        <div id="modalParents" className={`bg-slate-800/40 fixed w-[100vw] h-[100vh] flex justify-center items-center top-0 left-0 ${isOpen ? '' : 'hidden'}`}>
            <div className={`bg-white max-w-[400px] overflow-auto ${className || ''}`}>
                <header className="bg-slate-100 p-[8px] flex justify-between">
                    <p>{header}</p>
                    <p className="cursor-pointer hover:opacity-50" onClick={onClose}><IoCloseSharp /></p>
                </header>
                <div className={`p-[8px] max-h-[80vh] overflow-auto ${containerClass || ''}`}>
                    {children}
                </div>
                <footer className="flex p-[8px]">
                    {footerSecondaryBtn && <WhiteButton type="button">{footerSecondaryBtn}</WhiteButton>}
                    <Button type="button" onClick={primaryBtnFunc}> {footerPrimaryBtn}</Button>
                </footer>
            </div>
        </div>
    );
}