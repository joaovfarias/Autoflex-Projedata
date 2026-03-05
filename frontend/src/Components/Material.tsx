import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { TbWood } from "react-icons/tb";

type MaterialProps = {
  code: string;
  name: string;
  quantity: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function Material({
  code,
  name,
  quantity,
  onEdit,
  onDelete,
}: MaterialProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <article className="relative h-56 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div ref={menuRef} className="absolute right-2 top-2">
        <div className="flex items-center gap-39">
          <TbWood size={18} className="text-gray-400" />
          <button
            type="button"
            aria-label="Open material menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
          >
            <HiOutlineDotsVertical size={18} />
          </button>
        </div>
        <div
          className={`absolute right-0 mt-1 w-28 origin-top-right rounded-md border border-gray-200 bg-white shadow-md transition-all duration-150 ${
            menuOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onEdit();
            }}
            className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDelete();
            }}
            className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between pt-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Code</p>
          <p className="font-medium text-gray-900">{code}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
          <p className="font-semibold text-gray-900 truncate">{name}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Quantity
          </p>
          <p className="text-lg font-bold text-[#006D7A]">{quantity}</p>
        </div>
      </div>
    </article>
  );
}
