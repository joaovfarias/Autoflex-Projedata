import { LuBox } from "react-icons/lu";
import { TbWood } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[#f8fafd] min-h-screen p-4 rounded-tr-lg">
      <nav className="mt-2">
        <ul>
          <li className="mb-4">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-[#266eda13] ${isActive ? "bg-[#266eda13]" : ""}`
              }
            >
              <div className="flex items-center">
                <LuBox className="mr-2 w-4 h-4 text-[#000000]" />
                <p className="text-sm font-light">Products</p>
              </div>
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/materials"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-[#266eda13] ${isActive ? "bg-[#266eda13]" : ""}`
              }
            >
              <div className="flex items-center">
                <TbWood className="mr-2 w-4 h-4 text-[#000000]" />
                <p className="text-sm font-light">Materials</p>
              </div>
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/suggestions"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-[#266eda13] ${isActive ? "bg-[#266eda13]" : ""}`
              }
            >
              <div className="flex items-center">
                <TbMoneybag className="mr-2 w-4 h-4 text-[#000000]" />
                <p className="text-sm font-light">Product Suggestions</p>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
