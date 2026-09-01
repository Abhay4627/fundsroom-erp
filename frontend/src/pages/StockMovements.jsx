import { useEffect, useState } from "react";

function StockMovements() {
  const [movements, setMovements] = useState([]);

  const fetchMovements = async () => {
    try {
      const response = await fetch("https://fundsroom-erp-9r01.onrender.com/stock-movements");
      const data = await response.json();
      setMovements(data);
    } catch (error) {
      console.error("Failed to fetch stock movements", error);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div>
      <h1>Stock Movements</h1>
      <p>Track all stock IN and OUT movements</p>

      <div style={styles.container}>
        <h2>Movement History</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Movement Type</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Created At</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td style={styles.td}>{movement.id}</td>
                <td style={styles.td}>{movement.product_name}</td>
                <td style={styles.td}>{movement.quantity}</td>
                <td style={styles.td}>{movement.movement_type}</td>
                <td style={styles.td}>{movement.reason}</td>
                <td style={styles.td}>
                  {new Date(movement.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {movements.length === 0 && (
          <p>No stock movements found.</p>
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

export default StockMovements;