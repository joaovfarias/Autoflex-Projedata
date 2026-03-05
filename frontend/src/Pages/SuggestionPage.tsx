import { useEffect, useState } from "react";
import { LuBox } from "react-icons/lu";

type ProductionItem = {
  productCode: string;
  productName: string;
  quantityPossible: number;
  totalValue: number;
};

type ProductionSummary = {
  products: ProductionItem[];
  totalProductionValue: number;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function SuggestionPage() {
  const [summary, setSummary] = useState<ProductionSummary>({
    products: [],
    totalProductionValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductionSummary() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/production`);

        if (!response.ok) {
          setError("Failed to load production suggestions.");
          return;
        }

        const data = (await response.json()) as ProductionSummary;
        setSummary(data);
      } catch {
        setError("Failed to load production suggestions.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductionSummary();
  }, []);

  return (
    <section className="w-full">
      <h1 className="mb-6 text-xl font-semibold">
        Total production value:{" "}
        <span className="text-[#3246ff]">
          ${summary.totalProductionValue.toFixed(2)}
        </span>
      </h1>

      {isLoading ? (
        <p className="text-gray-500">Loading suggestions...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : summary.products.length === 0 ? (
        <p className="text-gray-500">No producible products found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {summary.products.map((item) => (
            <article
              key={`${item.productCode}-${item.productName}`}
              className="relative h-52 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-full flex-col justify-between">
                <LuBox size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Code
                  </p>
                  <p className="font-medium text-gray-900">
                    {item.productCode}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Product
                  </p>
                  <p className="font-semibold text-gray-900 truncate">
                    {item.productName}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Value
                  </p>
                  <p className="text-lg font-bold text-[#3246ff]">
                    ${item.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 right-3 rounded-md bg-[#3246ff] px-2 py-1 text-xs font-semibold text-white">
                {item.quantityPossible}x
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
