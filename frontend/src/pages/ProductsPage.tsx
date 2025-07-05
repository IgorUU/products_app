import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import Product from "../components/Product";

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
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
