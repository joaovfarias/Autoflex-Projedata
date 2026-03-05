import { useEffect, useState } from "react";
import Material from "../Components/Material";
import MaterialFormModal from "../Components/MaterialFormModal";
import { Alert, Snackbar } from "@mui/material";

type MaterialItem = {
  id?: number;
  code: string;
  name: string;
  stockQuantity: number;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [loadMaterialsError, setLoadMaterialsError] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setIsLoadingMaterials(true);
        setLoadMaterialsError(null);

        const response = await fetch(`${API_BASE_URL}/raw-materials`);
        if (!response.ok) {
          setLoadMaterialsError("Failed to load materials.");
          return;
        }

        const data = (await response.json()) as MaterialItem[];
        setMaterials(data);
      } catch {
        setLoadMaterialsError("Failed to load materials.");
      } finally {
        setIsLoadingMaterials(false);
      }
    }

    fetchMaterials();
  }, []);

  function resetForm() {
    setCode("");
    setName("");
    setQuantity("");
    setEditingIndex(null);
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!code.trim() || !name.trim() || !quantity.trim()) return;
    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) return;

    const payload = {
      code: code.trim(),
      name: name.trim(),
      stockQuantity: parsedQuantity,
    };

    if (editingIndex !== null) {
      const editingMaterial = materials[editingIndex];

      if (!editingMaterial || editingMaterial.id === undefined) {
        setMaterials((prev) =>
          prev.map((item, index) =>
            index === editingIndex ? { ...item, ...payload } : item,
          ),
        );
      } else {
        try {
          const response = await fetch(
            `${API_BASE_URL}/raw-materials/${editingMaterial.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          );

          if (!response.ok) {
            if (response.status === 409) {
              setSnackbarMessage(
                "A material with this code already exists. Please choose a different code.",
              );
              setSnackbarOpen(true);
            }

            return;
          }

          const updatedMaterial = (await response.json()) as MaterialItem;
          setMaterials((prev) =>
            prev.map((item, index) =>
              index === editingIndex ? updatedMaterial : item,
            ),
          );
        } catch {
          return;
        }
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/raw-materials`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          if (response.status === 409) {
            setSnackbarMessage(
              "A material with this code already exists. Please choose a different code.",
            );
            setSnackbarOpen(true);
          }
          return;
        }

        const createdMaterial = (await response.json()) as MaterialItem;
        setMaterials((prev) => [...prev, createdMaterial]);
      } catch {
        return;
      }
    }

    resetForm();
  }

  function handleEdit(index: number) {
    const item = materials[index];
    setCode(item.code);
    setName(item.name);
    setQuantity(String(item.stockQuantity));
    setEditingIndex(index);
    setIsModalOpen(true);
  }

  async function handleDelete(id: number | undefined, index: number) {
    if (id === undefined) {
      setMaterials((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/raw-materials/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      setMaterials((prev) => prev.filter((_, i) => i !== index));
    } catch {
      return;
    }
  }

  return (
    <>
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
            Add new Material
          </button>
        </div>

        {isLoadingMaterials ? (
          <p className="text-gray-500">Loading materials...</p>
        ) : loadMaterialsError ? (
          <p className="text-red-600">{loadMaterialsError}</p>
        ) : materials.length === 0 ? (
          <p className="text-gray-500">No materials yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {materials.map((material, index) => (
              <Material
                key={`${material.code}-${index}`}
                code={material.code}
                name={material.name}
                quantity={material.stockQuantity}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(material.id, index)}
              />
            ))}
          </div>
        )}

        <MaterialFormModal
          isOpen={isModalOpen}
          isEditing={editingIndex !== null}
          code={code}
          name={name}
          quantity={quantity}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onCodeChange={setCode}
          onNameChange={setName}
          onQuantityChange={setQuantity}
        />
      </section>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
