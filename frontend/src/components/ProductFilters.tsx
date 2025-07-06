import React from "react";

type ProductFiltersProps = {
  category: string;
  setCategory: (cat: string) => void;
  search: string;
  setSearch: (s: string) => void;
  categories: string[];
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  category,
  setCategory,
  search,
  setSearch,
  categories,
}) => (
  <div style={{ marginBottom: 16 }}>
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ marginRight: 8 }}
    />
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>
);

export default ProductFilters;
