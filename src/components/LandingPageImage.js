import Image from "next/image";


export default function LandingPageImage() {
    return (
        <div className="w-full sm:w-1/3 flex justify-center">
            <Image
                src="/landing_page_image.svg"
                alt="An image of two people in a meeting"
                width={500}
                height={400}
                className="object-contain"
            />
        </div>
    );
}