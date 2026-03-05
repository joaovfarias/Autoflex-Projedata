import { useEffect, useState } from "react";
import Product from "../Components/Product";
import ProductFormModal from "../Components/ProductFormModal";

type ProductItem = {
  id?: number;
  code: string;
  name: string;
  value: number;
};

type RawMaterialOption = {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
};

type ProductRawMaterialItem = {
  id?: {
    productId: number;
    rawMaterialId: number;
  };
  product?: {
    id: number;
  };
  rawMaterial?: RawMaterialOption;
  requiredQuantity: number;
};

type ProductBlueprint = {
  rawMaterialId: number;
  rawMaterialCode: string;
  rawMaterialName: string;
  requiredQuantity: number;
};

type BlueprintInputRow = {
  rawMaterialId: string;
  requiredQuantity: string;
};

type NormalizedBlueprintRow = {
  rawMaterialId: number;
  requiredQuantity: number;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterialOption[]>([]);
  const [materialsByProduct, setMaterialsByProduct] = useState<
    Record<number, ProductBlueprint[]>
  >({});
  const [blueprintRows, setBlueprintRows] = useState<BlueprintInputRow[]>([
    { rawMaterialId: "", requiredQuantity: "" },
  ]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [loadProductsError, setLoadProductsError] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    async function fetchProductsPageData() {
      try {
        setIsLoadingProducts(true);
        setLoadProductsError(null);

        const [
          productsResponse,
          rawMaterialsResponse,
          productRawMaterialsResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/raw-materials`),
          fetch(`${API_BASE_URL}/product-raw-materials`),
        ]);

        if (
          !productsResponse.ok ||
          !rawMaterialsResponse.ok ||
          !productRawMaterialsResponse.ok
        ) {
          setLoadProductsError("Failed to load products.");
          return;
        }

        const productsData = (await productsResponse.json()) as ProductItem[];
        const rawMaterialsData =
          (await rawMaterialsResponse.json()) as RawMaterialOption[];
        const productRawMaterialsData =
          (await productRawMaterialsResponse.json()) as ProductRawMaterialItem[];

        const blueprints: Record<number, ProductBlueprint[]> = {};

        productRawMaterialsData.forEach((item) => {
          const productId = item.product?.id ?? item.id?.productId;
          const rawMaterialId = item.rawMaterial?.id ?? item.id?.rawMaterialId;

          if (!productId || !rawMaterialId || !item.rawMaterial) {
            return;
          }

          if (!blueprints[productId]) {
            blueprints[productId] = [];
          }

          blueprints[productId].push({
            rawMaterialId,
            rawMaterialCode: item.rawMaterial.code,
            rawMaterialName: item.rawMaterial.name,
            requiredQuantity: item.requiredQuantity,
          });
        });

        setProducts(productsData);
        setRawMaterials(rawMaterialsData);
        setMaterialsByProduct(blueprints);
      } catch {
        setLoadProductsError("Failed to load products.");
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProductsPageData();
  }, []);

  function resetForm() {
    setCode("");
    setName("");
    setValue("");
    setBlueprintRows([{ rawMaterialId: "", requiredQuantity: "" }]);
    setEditingIndex(null);
    setIsModalOpen(false);
  }

  function addBlueprintRow() {
    setBlueprintRows((prev) => [
      ...prev,
      { rawMaterialId: "", requiredQuantity: "" },
    ]);
  }

  function removeBlueprintRow(index: number) {
    setBlueprintRows((prev) =>
      prev.filter((_, rowIndex) => rowIndex !== index),
    );
  }

  function updateBlueprintRow(
    index: number,
    field: keyof BlueprintInputRow,
    nextValue: string,
  ) {
    setBlueprintRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: nextValue } : row,
      ),
    );
  }

  function normalizeBlueprintRows(): NormalizedBlueprintRow[] {
    return blueprintRows
      .map((row) => ({
        rawMaterialId: Number(row.rawMaterialId),
        requiredQuantity: Number(row.requiredQuantity),
      }))
      .filter(
        (row) =>
          Number.isInteger(row.rawMaterialId) &&
          row.rawMaterialId > 0 &&
          Number.isFinite(row.requiredQuantity) &&
          row.requiredQuantity > 0,
      );
  }

  function toProductBlueprints(
    rows: NormalizedBlueprintRow[],
  ): ProductBlueprint[] {
    return rows
      .map((row) => {
        const material = rawMaterials.find(
          (option) => option.id === row.rawMaterialId,
        );

        if (!material) {
          return null;
        }

        return {
          rawMaterialId: row.rawMaterialId,
          rawMaterialCode: material.code,
          rawMaterialName: material.name,
          requiredQuantity: row.requiredQuantity,
        };
      })
      .filter((item): item is ProductBlueprint => item !== null);
  }

  async function syncProductBlueprints(
    productId: number,
    nextRows: NormalizedBlueprintRow[],
  ) {
    const existingRows = materialsByProduct[productId] ?? [];
    const existingMap = new Map(
      existingRows.map((row) => [row.rawMaterialId, row.requiredQuantity]),
    );
    const nextMap = new Map(
      nextRows.map((row) => [row.rawMaterialId, row.requiredQuantity]),
    );

    const toDelete: number[] = [];
    existingMap.forEach((existingQuantity, rawMaterialId) => {
      const nextQuantity = nextMap.get(rawMaterialId);
      if (nextQuantity === undefined || nextQuantity !== existingQuantity) {
        toDelete.push(rawMaterialId);
      }
    });

    const toCreate = nextRows.filter((row) => {
      const existingQuantity = existingMap.get(row.rawMaterialId);
      return (
        existingQuantity === undefined ||
        existingQuantity !== row.requiredQuantity
      );
    });

    await Promise.all(
      toDelete.map((rawMaterialId) =>
        fetch(
          `${API_BASE_URL}/product-raw-materials?productId=${productId}&rawMaterialId=${rawMaterialId}`,
          {
            method: "DELETE",
          },
        ),
      ),
    );

    await Promise.all(
      toCreate.map((row) =>
        fetch(`${API_BASE_URL}/product-raw-materials`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            rawMaterialId: row.rawMaterialId,
            requiredQuantity: row.requiredQuantity,
          }),
        }),
      ),
    );

    setMaterialsByProduct((prev) => ({
      ...prev,
      [productId]: toProductBlueprints(nextRows),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!code.trim() || !name.trim() || !value.trim()) return;
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) return;
    const normalizedBlueprints = normalizeBlueprintRows();

    const payload = {
      code: code.trim(),
      name: name.trim(),
      value: parsedValue,
    };

    if (editingIndex !== null) {
      const editingProduct = products[editingIndex];

      if (!editingProduct || editingProduct.id === undefined) {
        setProducts((prev) =>
          prev.map((item, index) =>
            index === editingIndex ? { ...item, ...payload } : item,
          ),
        );
      } else {
        try {
          const response = await fetch(
            `${API_BASE_URL}/products/${editingProduct.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          );

          if (!response.ok) {
            return;
          }

          const updatedProduct = (await response.json()) as ProductItem;
          await syncProductBlueprints(editingProduct.id, normalizedBlueprints);
          setProducts((prev) =>
            prev.map((item, index) =>
              index === editingIndex ? updatedProduct : item,
            ),
          );
        } catch {
          return;
        }
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          return;
        }

        const createdProduct = (await response.json()) as ProductItem;

        if (
          createdProduct.id !== undefined &&
          normalizedBlueprints.length > 0
        ) {
          await Promise.all(
            normalizedBlueprints.map((blueprint) =>
              fetch(`${API_BASE_URL}/product-raw-materials`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productId: createdProduct.id,
                  rawMaterialId: blueprint.rawMaterialId,
                  requiredQuantity: blueprint.requiredQuantity,
                }),
              }),
            ),
          );

          setMaterialsByProduct((prev) => ({
            ...prev,
            [createdProduct.id as number]:
              toProductBlueprints(normalizedBlueprints),
          }));
        }

        setProducts((prev) => [...prev, createdProduct]);
      } catch {
        return;
      }
    }

    resetForm();
  }

  function handleEdit(index: number) {
    const item = products[index];
    setCode(item.code);
    setName(item.name);
    setValue(String(item.value));
    if (item.id !== undefined) {
      const existingBlueprintRows = materialsByProduct[item.id] ?? [];
      setBlueprintRows(
        existingBlueprintRows.length > 0
          ? existingBlueprintRows.map((row) => ({
              rawMaterialId: String(row.rawMaterialId),
              requiredQuantity: String(row.requiredQuantity),
            }))
          : [{ rawMaterialId: "", requiredQuantity: "" }],
      );
    } else {
      setBlueprintRows([{ rawMaterialId: "", requiredQuantity: "" }]);
    }
    setEditingIndex(index);
    setIsModalOpen(true);
  }

  async function handleDelete(id: number | undefined, index: number) {
    if (id === undefined) {
      setProducts((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      setProducts((prev) => prev.filter((_, i) => i !== index));
      setMaterialsByProduct((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch {
      return;
    }
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setEditingIndex(null);
            setIsModalOpen(true);
          }}
          className="rounded-md bg-[#006D7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#005a66]"
        >
          Add new Product
        </button>
      </div>

      {isLoadingProducts ? (
        <p className="text-gray-500">Loading products...</p>
      ) : loadProductsError ? (
        <p className="text-red-600">{loadProductsError}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {products.map((product, index) => (
            <Product
              key={`${product.code}-${index}`}
              code={product.code}
              name={product.name}
              value={product.value}
              materials={
                product.id !== undefined
                  ? (materialsByProduct[product.id] ?? [])
                  : []
              }
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(product.id, index)}
            />
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        isEditing={editingIndex !== null}
        code={code}
        name={name}
        value={value}
        blueprintRows={blueprintRows}
        rawMaterials={rawMaterials}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        onCodeChange={setCode}
        onNameChange={setName}
        onValueChange={setValue}
        onAddBlueprintRow={addBlueprintRow}
        onRemoveBlueprintRow={removeBlueprintRow}
        onUpdateBlueprintRow={updateBlueprintRow}
      />
    </section>
  );
}
