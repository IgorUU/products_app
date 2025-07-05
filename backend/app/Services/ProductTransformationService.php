<?php

namespace App\Services;

class ProductTransformationService {

  public function transform(array $products): array {
    return collect($products)
      ->map(fn($product) => $this->transformProduct($product))
      ->toArray();
  }

  protected function transformProduct(array $product): array {
    if (isset($product['categoryName']) && $product['categoryName'] == 'Monitori' && isset($product['price'])) {
      $new_price = $product['price'] * 1.10;
      $product['price'] = number_format($new_price, 2, '.', ' ');
    }

    if (isset($product['description'])) {
      $product['description'] = str_ireplace('brzina', 'performanse', $product['description']);
    }

    return $product;
  }
}
