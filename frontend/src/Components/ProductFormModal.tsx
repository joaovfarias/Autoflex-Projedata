type RawMaterialOption = {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
};

type BlueprintInputRow = {
  rawMaterialId: string;
  requiredQuantity: string;
};

type ProductFormModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  code: string;
  name: string;
  value: string;
  blueprintRows: BlueprintInputRow[];
  rawMaterials: RawMaterialOption[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onAddBlueprintRow: () => void;
  onRemoveBlueprintRow: (index: number) => void;
  onUpdateBlueprintRow: (
    index: number,
    field: "rawMaterialId" | "requiredQuantity",
    nextValue: string,
  ) => void;
};

export default function ProductFormModal({
  isOpen,
  isEditing,
  code,
  name,
  value,
  blueprintRows,
  rawMaterials,
  onSubmit,
  onCancel,
  onCodeChange,
  onNameChange,
  onValueChange,
  onAddBlueprintRow,
  onRemoveBlueprintRow,
  onUpdateBlueprintRow,
}: ProductFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isEditing ? "Edit Product" : "Add new Product"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#006D7A]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#006D7A]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="value"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Value
            </label>
            <input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#006D7A]"
              required
            />
          </div>

          <div className="space-y-3 rounded-md border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Raw materials blueprint
              </p>
              <button
                type="button"
                onClick={onAddBlueprintRow}
                className="cursor-pointer rounded-md border border-[#006D7A] px-2 py-1 text-xs font-medium text-[#006D7A] hover:bg-[#e6f3f5]"
              >
                + Add material
              </button>
            </div>

            {blueprintRows.map((row, rowIndex) => {
              const selectedIds = blueprintRows
                .filter((_, index) => index !== rowIndex)
                .map((item) => Number(item.rawMaterialId))
                .filter((id) => Number.isInteger(id) && id > 0);

              return (
                <div
                  key={`blueprint-row-${rowIndex}`}
                  className="grid grid-cols-12 gap-2"
                >
                  <div className="col-span-7">
                    <select
                      value={row.rawMaterialId}
                      onChange={(e) =>
                        onUpdateBlueprintRow(
                          rowIndex,
                          "rawMaterialId",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#006D7A]"
                    >
                      <option value="">Select raw material</option>
                      {rawMaterials.map((material) => (
                        <option
                          key={material.id}
                          value={material.id}
                          disabled={selectedIds.includes(material.id)}
                        >
                          {material.code} - {material.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      min="1"
                      value={row.requiredQuantity}
                      onChange={(e) =>
                        onUpdateBlueprintRow(
                          rowIndex,
                          "requiredQuantity",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#006D7A]"
                      placeholder="Qt"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => onRemoveBlueprintRow(rowIndex)}
                      disabled={blueprintRows.length === 1}
                      className="cursor-pointer w-full rounded-md border border-gray-300 px-2 py-2 text-center text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-[#006D7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#005a66]"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
