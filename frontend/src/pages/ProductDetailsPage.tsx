import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../api/products";

type ProductType = {
  naziv: string;
  sku: string;
  ean: string;
  price: number;
  vat: string;
  stock: string;
  description: string;
  imgsrc: string;
  sif_product: string;
  categoryName: string;
  brandName: string;
};

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>Back to Products</button>
      </div>
    );
  if (!product) return <p>No product found.</p>;

  return (
    <div>
      <h2>{product.naziv}</h2>
      <img src={product.imgsrc} alt={product.naziv} style={{ maxWidth: 200 }} />
      <p>
        <strong>SKU:</strong> {product.sku}
      </p>
      <p>
        <strong>EAN:</strong> {product.ean}
      </p>
      <p>
        <strong>Price:</strong> {product.price}
      </p>
      <p>
        <strong>VAT:</strong> {product.vat}
      </p>
      <p>
        <strong>Stock:</strong> {product.stock}
      </p>
      <p>
        <strong>Description:</strong> {/* Potential security risk */}
        <span dangerouslySetInnerHTML={{ __html: product.description }} />
      </p>
      <p>
        <strong>Brand:</strong> {product.brandName}
      </p>
      <button onClick={() => navigate(-1)}>Back to Products</button>
    </div>
  );
};

export default ProductDetailsPage;
