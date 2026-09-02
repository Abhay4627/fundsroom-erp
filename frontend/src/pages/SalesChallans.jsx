import { useEffect, useState } from "react";

const API_URL = "https://fundsroom-erp-9ro1.onrender.com";

function SalesChallans() {
  const [challans, setChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    status: "Draft",
    products: [{ product_id: "", quantity: 1 }],
  });

  const getToken = () => localStorage.getItem("token");

  const fetchChallans = async () => {
    try {
      const response = await fetch(`${API_URL}/challans`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch challans");
        return;
      }

      setChallans(data);
    } catch (error) {
      console.error("Failed to fetch challans", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch customers");
        return;
      }

      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch products");
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchChallans();
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...form.products];

    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };

    setForm({
      ...form,
      products: updatedProducts,
    });
  };

  const addProductRow = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        { product_id: "", quantity: 1 },
      ],
    });
  };

  const removeProductRow = (index) => {
    if (form.products.length === 1) {
      return;
    }

    const updatedProducts = form.products.filter(
      (_, i) => i !== index
    );

    setForm({
      ...form,
      products: updatedProducts,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer_id) {
      alert("Please select a customer");
      return;
    }

    const hasInvalidProduct = form.products.some(
      (item) =>
        !item.product_id ||
        !item.quantity ||
        Number(item.quantity) <= 0
    );

    if (hasInvalidProduct) {
      alert("Please select product and enter valid quantity");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/challans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          customer_id: Number(form.customer_id),
          status: form.status,
          products: form.products.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create challan");
        return;
      }

      alert("Challan created successfully!");

      setForm({
        customer_id: "",
        status: "Draft",
        products: [{ product_id: "", quantity: 1 }],
      });

      setShowForm(false);

      fetchChallans();
      fetchProducts();
    } catch (error) {
      alert("Unable to connect to backend");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1>Sales Challans</h1>
          <p>Manage sales challans and their status</p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Create Challan"}
        </button>
      </div>

      {/* CREATE CHALLAN FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>Create Sales Challan</h2>

          <label>Customer</label>

          <select
            value={form.customer_id}
            onChange={(e) =>
              setForm({
                ...form,
                customer_id: e.target.value,
              })
            }
            required
            style={styles.input}
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.customer_name}
              </option>
            ))}
          </select>

          <label>Status</label>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            style={styles.input}
          >
            <option value="Draft">Draft</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <h3>Products</h3>

          {form.products.map((item, index) => (
            <div key={index} style={styles.productRow}>
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "product_id",
                    e.target.value
                  )
                }
                required
                style={styles.productSelect}
              >
                <option value="">Select Product</option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.product_name} - Stock:{" "}
                    {product.current_stock}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
                style={styles.quantityInput}
                required
              />

              <button
                type="button"
                onClick={() => removeProductRow(index)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addProductRow}
            style={styles.addProductButton}
          >
            + Add Product
          </button>

          <button type="submit" style={styles.saveButton}>
            Create Challan
          </button>
        </form>
      )}

      {/* CHALLAN LIST */}
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

                <td style={styles.td}>
                  {challan.challan_number}
                </td>

                <td style={styles.td}>
                  {challan.customer_name}
                </td>

                <td style={styles.td}>
                  {challan.total_quantity}
                </td>

                <td style={styles.td}>
                  {challan.status}
                </td>

                <td style={styles.td}>
                  {new Date(
                    challan.created_at
                  ).toLocaleString()}
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  addButton: {
    padding: "12px 18px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  form: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "25px",
    display: "grid",
    gap: "12px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  productRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  productSelect: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  quantityInput: {
    width: "100px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  addProductButton: {
    padding: "10px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  removeButton: {
    padding: "8px 12px",
    background: "#777",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  saveButton: {
    padding: "12px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

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