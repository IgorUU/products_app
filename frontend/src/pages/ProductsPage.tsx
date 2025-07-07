import { useEffect, useState } from "react";
import { fetchProducts, fetchCategories } from "../api/products";
import Product from "../components/Product";
import LogoutUser from "../components/Logout";
import ProductFilters from "../components/ProductFilters";
import { useDebounce } from "../hooks/useDebounce";

type ProductType = {
  naziv: string;
  sku: string;
  ean: string;
  price: number;
  vat: string;
  stock: string;
  description: string;
  imgsrc: string;
  categoryName: string;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Don't set error here, just log it
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const products = await fetchProducts({
          category: category || undefined,
          search: debouncedSearch || undefined,
        });
        setProducts(products);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, debouncedSearch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <div>
        <LogoutUser />
      </div>
      <div>
        <h1>Products</h1>
        <ProductFilters
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          categories={categories}
        />
        {/* Composite key: sku repeats, added index for uniqueness */}
        {products.map((product, index) => (
          <Product key={`${product.sku}-${index}`} product={product} />
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
