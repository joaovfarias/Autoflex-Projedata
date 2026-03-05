type MaterialFormModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  code: string;
  name: string;
  quantity: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
};

export default function MaterialFormModal({
  isOpen,
  isEditing,
  code,
  name,
  quantity,
  onSubmit,
  onCancel,
  onCodeChange,
  onNameChange,
  onQuantityChange,
}: MaterialFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isEditing ? "Edit Material" : "Add new Material"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="material-code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Code
            </label>
            <input
              id="material-code"
              type="text"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#006D7A]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="material-name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="material-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#006D7A]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="material-quantity"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              id="material-quantity"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#006D7A]"
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#006D7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#005a66]"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
