type ProductProps = {
  product: {
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
};

const Product = ({ product }: ProductProps) => {
  return (
    <div>
      {product.imgsrc && (
        <img
          src={product.imgsrc}
          alt={product.naziv}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      <p>{product.naziv}</p>
      <p>{product.price}</p>
    </div>
  );
};

export default Product;
