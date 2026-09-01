import { useEffect, useState } from "react";

function SalesChallans() {
  const [challans, setChallans] = useState([]);

  const fetchChallans = async () => {
    try {
      const response = await fetch("http://localhost:5000/challans");
      const data = await response.json();
      setChallans(data);
    } catch (error) {
      console.error("Failed to fetch challans", error);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  return (
    <div>
      <h1>Sales Challans</h1>
      <p>Manage sales challans and their status</p>

      <div style={styles.container}>
        <h2>Challan List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Challan Number</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Total Quantity</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created At</th>
            </tr>
          </thead>

          <tbody>
            {challans.map((challan) => (
              <tr key={challan.id}>
                <td style={styles.td}>{challan.id}</td>
                <td style={styles.td}>{challan.challan_number}</td>
                <td style={styles.td}>{challan.customer_name}</td>
                <td style={styles.td}>{challan.total_quantity}</td>
                <td style={styles.td}>{challan.status}</td>
                <td style={styles.td}>
                  {new Date(challan.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {challans.length === 0 && (
          <p>No challans found.</p>
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

export default SalesChallans;