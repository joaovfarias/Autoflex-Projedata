import { IoMdSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full p-4 bg-[#f8fafd]">
      <div
        className="flex items-center hover:cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <span className="text-[#006D7A] text-2xl font-bold mr-2">FlexAuto</span>
      </div>
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search for products or materials..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006D7A]"
        />
        <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      <div className="flex items-center">
        <IoSettingsOutline className="text-[#006D7A] mr-6 w-5 h-5" />
        <FaUser className="text-[#006D7A] mr-2 w-5 h-5" />
      </div>
    </header>
  );
}
