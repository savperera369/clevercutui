"use client"
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

type Props = {
    buttonTitle: string,
    content: string,
    href: string,
}

const ExpandButton = ({ buttonTitle, content, href } : Props) => {
    return (
        <div className="w-full border-none flex flex-col items-center justify-center p-4">
            <Link href={href} className="w-1/2">
                <button className="w-full flex items-center justify-center gap-x-1 px-4 py-4 rounded-lg text-md font-medium bg-white transition-all hover:bg-gray-300"
                >
                    { buttonTitle }
                    <FaArrowRight className="ml-2" />
                </button>
            </Link>
            <div className="mt-4 p-4 h-full flex flex-col items-center gap-y-2">
                <p className="font-medium text-white text-md text-center">
                    {content}
                </p>
            </div>
        </div>
    );
};

export default ExpandButton;
