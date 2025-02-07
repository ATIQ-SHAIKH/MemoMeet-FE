import Image from "next/image";

export default function HomeNavBar({time, date}) {
    return (
        <nav className="p-4 flex items-center justify-between">
            <div className="flex items-center">
                <Image src="/logo.svg" alt="Memo Meet Logo" width={40} height={40} />
                <span className="ml-2 text-white text-lg font-bold">Memo Meet</span>
            </div>

            <div className="text-white text-sm text-right">
                <div>{time}</div>
                <div>{date}</div>
            </div>
        </nav>
    );
}