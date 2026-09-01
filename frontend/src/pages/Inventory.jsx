import { useEffect, useState } from "react";

function Inventory() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fundsroom-erp-9r01.onrender.com/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>
      <p>Current stock available in warehouse</p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>SKU</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Minimum Stock</th>
            <th style={styles.th}>Location</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={styles.td}>{product.id}</td>
              <td style={styles.td}>{product.product_name}</td>
              <td style={styles.td}>{product.sku}</td>
              <td style={styles.td}>{product.category}</td>
              <td style={styles.td}>{product.current_stock}</td>
              <td style={styles.td}>{product.minimum_stock_quantity}</td>
              <td style={styles.td}>{product.warehouse_location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p>No inventory found.</p>
      )}
    </div>
  );
}

const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    background: "#f5f5f5",
  },

  td: {
    border: "1px solid #ddd",
    padding: "10px",
  },
};

export default Inventory;