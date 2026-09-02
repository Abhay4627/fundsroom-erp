import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fundsroom-erp-9ro1.onrender.com/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <p>Manage products and inventory stock</p>

      <div style={styles.container}>
        <h2>Product List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>₹{product.unit_price}</td>
                <td>{product.current_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginTop: "25px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default Products;