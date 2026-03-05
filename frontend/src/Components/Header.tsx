import { IoMdSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import projedata_logo from "../assets/projedata_logo.png";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full p-4 bg-[#f8fafd]">
      <div
        className="flex items-center hover:cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <div className="flex items-center justify-center">
          <img
            src={projedata_logo}
            alt="Projedata Logo"
            className="w-10 h-10 mr-2"
          />
          <span className="text-[#3246ff] text-2xl font-bold mr-2">
            FlexAuto
          </span>
        </div>
      </div>
      <div className="relative w-1/3">
        <input
          type="text"
          disabled={true}
          placeholder="Search for products or materials..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3246ff]"
        />
        <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      <div className="flex items-center">
        <IoSettingsOutline className="text-[#3246ff] mr-6 w-5 h-5" />
        <FaUser className="text-[#3246ff] mr-2 w-5 h-5" />
      </div>
    </header>
  );
}
