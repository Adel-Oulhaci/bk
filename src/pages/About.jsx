import { ABOUT } from "../services/Details";
import reg from "../assets/Cvrt1.png";
import goals from "../assets/goals.png";

export default function About() {
    return (
        <>
            <div className="relative">
                <img src={reg} className="w-full h-64 sm:h-[400px] md:h-[600px] object-cover blur-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full -translate-y-1/2">
                    <h1 className="uppercase text-center text-white font-semibold mb-1 text-3xl sm:text-5xl md:text-6xl lg:mb-6 lg:text-7xl">
                        ABOUT US
                    </h1>
                </div>
            </div>
            {ABOUT.map((about) => (
                about.id % 2 === 0 ? (
                    <div key={about.id} className="px-4 sm:mx-10 md:mx-24 my-8 md:my-16 lg:my-24">
                        <div className="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-center font-medium lg:font-semibold">
                            <h1>{about.title}</h1>
                            <p className="text-green-bk pl-2">{about.titleGreen}</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 lg:gap-12 justify-evenly items-center">
                            <div className="relative w-48 sm:w-72 md:w-96 lg:w-[27rem] mt-4">
                                <div className="absolute w-full h-full rounded-tr-lg border rounded-bl-lg border-1 border-dark-one7 right-4 top-4 z-0"></div>
                                <img
                                    src={about.img}
                                    className="w-full rounded-tr-lg rounded-bl-lg z-10 relative"
                                    alt="reg"
                                />
                            </div>
                            <div className="text-center mt-4 md:mt-0 md:w-1/2 md:text-start">
                                <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-3xl">
                                    {about.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={about.id} className="px-4 sm:mx-10 md:mx-24 my-8 md:my-16 lg:my-24">
                        <div className="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-center font-medium lg:font-semibold">
                            <h1>{about.title}</h1>
                            <p className="text-green-bk pl-2">{about.titleGreen}</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 lg:gap-12 justify-evenly items-center">
                            <div className="text-center mt-4 md:mt-0 md:w-1/2 md:text-start">
                                <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-3xl">
                                    {about.description}
                                </p>
                            </div>
                            <div className="relative w-48 sm:w-72 md:w-96 lg:w-[27rem] mt-4">
                                <div className="absolute w-full h-full rounded-tr-lg border rounded-bl-lg border-1 border-dark-one7 right-4 top-4 z-0"></div>
                                <img
                                    src={about.img}
                                    className="w-full rounded-tr-lg rounded-bl-lg z-10 relative"
                                    alt="reg"
                                />
                            </div>
                        </div>
                    </div>
                )
            ))}
            <div className="px-4 sm:mx-10 md:mx-24 my-8 md:my-16 lg:my-24">
                <div className="flex justify-center items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-center font-medium lg:font-semibold">
                    <h1>CLUB</h1>
                    <p className="text-green-bk pl-2">goals</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 lg:gap-12 justify-evenly items-center">
                <div className=" mt-4 md:mt-0 md:w-1/2 md:text-start">
                        <ul className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-3xl list-disc pl-5">
                            <li>Spreading goodness in the community</li>
                            <li>Giving talented people a chance to shine and progress</li>
                            <li>Providing scientific services for students</li>
                            <li>Enabling students to take responsibility and work together</li>
                            <li>Acquiring various skills that aid in personal and professional life</li>
                        </ul>
                    </div>
                    <div className="relative w-48 sm:w-72 md:w-96 lg:w-[27rem] mt-4">
                        <div className="absolute w-full h-full rounded-tr-lg border rounded-bl-lg border-1 border-dark-one7 right-4 top-4 z-0"></div>
                        <img
                            src={goals}
                            className="w-full rounded-tr-lg rounded-bl-lg z-10 relative"
                            alt="goals"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
