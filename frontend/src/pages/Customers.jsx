import { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    mobile: "",
    email: "",
    business_name: "",
    gst_number: "",
    customer_type: "Wholesale",
    address: "",
    status: "Active",
    follow_up_date: "",
    notes: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await fetch("https://fundsroom-erp-9r01.onrender.com/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://fundsroom-erp-9r01.onrender.com/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create customer");
        return;
      }

      alert("Customer added successfully!");

      setForm({
        customer_name: "",
        mobile: "",
        email: "",
        business_name: "",
        gst_number: "",
        customer_type: "Wholesale",
        address: "",
        status: "Active",
        follow_up_date: "",
        notes: "",
      });

      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      alert("Unable to connect to backend");
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1>Customers</h1>
          <p>Manage your customers and CRM information</p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Customer"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>Add Customer</h2>

          <input
            name="customer_name"
            placeholder="Customer Name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="business_name"
            placeholder="Business Name"
            value={form.business_name}
            onChange={handleChange}
          />

          <input
            name="gst_number"
            placeholder="GST Number"
            value={form.gst_number}
            onChange={handleChange}
          />

          <select
            name="customer_type"
            value={form.customer_type}
            onChange={handleChange}
          >
            <option value="Wholesale">Wholesale</option>
            <option value="Retail">Retail</option>
            <option value="Individual">Individual</option>
          </select>

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            name="follow_up_date"
            type="date"
            value={form.follow_up_date}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit" style={styles.saveButton}>
            Save Customer
          </button>
        </form>
      )}

      <div style={styles.tableContainer}>
        <h2>Customer List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Business</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.customer_name}</td>
                <td>{customer.business_name}</td>
                <td>{customer.mobile}</td>
                <td>{customer.email}</td>
                <td>{customer.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p style={styles.empty}>No customers found.</p>
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

  tableContainer: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  saveButton: {
    padding: "12px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};

export default Customers;