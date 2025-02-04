"use client"
import { useState } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import Link from "next/link";

type Props = {
    buttonTitle: string,
    content: string,
    href: string,
}

const ExpandButton = ({ buttonTitle, content, href } : Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const icon = isOpen ? <IoIosRemove className="h-6 w-6"/> : <IoIosAdd className="h-6 w-6" />

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full border-none flex flex-col items-center justify-center p-4">
            <button className="w-1/2 flex items-center justify-center gap-x-1 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900"
                    onClick={togglePanel}
            >
                { icon }
                { buttonTitle }
            </button>
            {isOpen ? (
                <div className="mt-4 p-4 h-full flex flex-col items-center gap-y-2 border border-dashed rounded-md border-black">
                    <p className="text-sm font-medium">
                        {content}
                    </p>
                    <Link className="text-sm text-sky-500 transition-all hover:underline hover:underline-offset-2" href={href}>See More</Link>
                </div>
            ) : null}
        </div>
    );
};

export default ExpandButton;
