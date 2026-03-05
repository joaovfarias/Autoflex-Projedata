import Header from "./Components/Header";
import Sidebar from "./Components/SideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import ProductsPage from "./Pages/ProductsPage";
import MaterialsPage from "./Pages/MaterialsPage";
import SuggestionPage from "./Pages/SuggestionPage";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/suggestions" element={<SuggestionPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
