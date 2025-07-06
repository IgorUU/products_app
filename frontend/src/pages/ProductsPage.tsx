import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
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
  const debouncedSearch = useDebounce(search, 1000);

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

  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map((p) => p.categoryName).filter(Boolean))
  );

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
        {products.map((product) => (
          <Product key={product.sku} product={product} />
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
