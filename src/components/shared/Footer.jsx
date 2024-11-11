import logo from "../../assets/logo.png";
import {
  FaLocationDot,
  FaTiktok,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";

export default function Footer() {
  return (
    <div className="pt-4 px-4 md:px-24 flex flex-col space-y-6 border-t border-1 border-gray-one7 bg-dark-one7 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-16">
          <img src={logo} className="w-14  mr-2" alt="Logo" />
          {/* <nav className="space-x-8">
            <a href="#" className="text-gray-400 hover:text-white">
              Home
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Services
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Work
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Shop
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              About
            </a>
          </nav> */}
        </div>
        <div className="flex items-center space-x-0 border border-1 rounded-md border-gray-one7">
          <div className="flex space-x-1 md:space-x-2 p-2">
            <a
              href="#"
              className="bg-gradient-social flex justify-center  items-center p-2 rounded-md border border-1 border-gray-one7"
            >
              <FaFacebookF className="bg-white p-1 h-6 w-6 rounded-full" />
            </a>
            <a
              href="#"
              className="bg-gradient-social flex justify-center  items-center p-2 rounded-md border border-1 border-gray-one7"
            >
              <FaInstagram className="bg-white p-1 h-6 w-6 rounded-full" />
            </a>
            <a
              href="#"
              className="bg-gradient-social flex justify-center  items-center p-2 rounded-md border border-1 border-gray-one7"
            >
              <FaTiktok className="bg-white p-1 h-6 w-6 rounded-full" />
            </a>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-one7" />
      <div className="flex justify-between flex-col lg:flex-row items-center pb-7 text-gray-400 text-sm">
        <div className="flex sm:gap-4 gap-2  flex-wrap items-center pb-3 lg:pb-0 w-full lg:w-max justify-between border-b lg:border-none border-1 border-gray-one7">
          <div className="flex items-center border-b-2 lg:mt-0 mt-2 border-gray-one7 pb-2 space-x-2">
            <MdEmail className=" text-green-one7 text-lg" />
            <span className="text-white">clubbadratkhayr@gmail.com</span>
          </div>
          <div className="flex items-center border-b-2 lg:mt-0 mt-2 border-gray-one7 pb-2 space-x-2">
            <BsFillTelephoneFill className=" text-green-one7 text-lg" />
            <span className="text-white">+213600000000</span>
          </div>
          <div className="flex items-center mx-auto sm:mx-0 border-b-2 lg:mt-0 mt-2 border-gray-one7 pb-2 space-x-2">
            <FaLocationDot className=" text-green-one7 text-lg" />
            <span className="text-white">Sidi Bel Abbès, Algeria</span>
          </div>
        </div>
        <div className="mt-2  lg:mt-0 text-gray-300">
          © 2024 Badrat khayr. All rights reserved.
        </div>
      </div>
    </div>
  );
}
