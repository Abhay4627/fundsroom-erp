import { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const emptyForm = {
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
  };

  const [form, setForm] = useState(emptyForm);

  const API_URL = "https://fundsroom-erp-9ro1.onrender.com";

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const token = localStorage.getItem("token");

      const url = editingCustomer
        ? `${API_URL}/customers/${editingCustomer.id}`
        : `${API_URL}/customers`;

      const response = await fetch(url, {
        method: editingCustomer ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            (editingCustomer
              ? "Failed to update customer"
              : "Failed to create customer")
        );
        return;
      }

      alert(
        editingCustomer
          ? "Customer updated successfully!"
          : "Customer added successfully!"
      );

      setForm(emptyForm);
      setShowForm(false);
      setEditingCustomer(null);

      fetchCustomers();
    } catch (error) {
      alert("Unable to connect to backend");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setSelectedCustomer(null);

    setForm({
      customer_name: customer.customer_name || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      business_name: customer.business_name || "",
      gst_number: customer.gst_number || "",
      customer_type: customer.customer_type || "Wholesale",
      address: customer.address || "",
      status: customer.status || "Active",
      follow_up_date: customer.follow_up_date
        ? customer.follow_up_date.substring(0, 10)
        : "",
      notes: customer.notes || "",
    });

    setShowForm(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setForm(emptyForm);
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.customer_name?.toLowerCase().includes(searchText) ||
      customer.business_name?.toLowerCase().includes(searchText) ||
      customer.mobile?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1>Customers</h1>
          <p>Manage your customers and CRM information</p>
        </div>

        <button
          style={styles.addButton}
          onClick={showForm ? handleCloseForm : handleAddCustomer}
        >
          {showForm ? "Close Form" : "+ Add Customer"}
        </button>
      </div>

      {/* ADD / EDIT CUSTOMER FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>

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
            <option value="Distributor">Distributor</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
            placeholder="Notes / Follow-up Notes"
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit" style={styles.saveButton}>
            {editingCustomer ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      )}

      {/* CUSTOMER LIST */}
      <div style={styles.tableContainer}>
        <div style={styles.listHeader}>
          <h2>Customer List</h2>

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Business</th>
              <th style={styles.th}>Mobile</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td style={styles.td}>{customer.id}</td>
                <td style={styles.td}>{customer.customer_name}</td>
                <td style={styles.td}>{customer.business_name}</td>
                <td style={styles.td}>{customer.mobile}</td>
                <td style={styles.td}>{customer.email}</td>
                <td style={styles.td}>{customer.status}</td>

                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      style={styles.viewButton}
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(customer)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <p style={styles.empty}>No customers found.</p>
        )}
      </div>

      {/* CUSTOMER DETAILS */}
      {selectedCustomer && (
        <div style={styles.detailsContainer}>
          <div style={styles.detailsHeader}>
            <h2>Customer Details</h2>

            <button
              onClick={() => setSelectedCustomer(null)}
              style={styles.closeButton}
            >
              Close
            </button>
          </div>

          <div style={styles.detailsGrid}>
            <p>
              <strong>Name:</strong>{" "}
              {selectedCustomer.customer_name || "N/A"}
            </p>

            <p>
              <strong>Mobile:</strong>{" "}
              {selectedCustomer.mobile || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedCustomer.email || "N/A"}
            </p>

            <p>
              <strong>Business:</strong>{" "}
              {selectedCustomer.business_name || "N/A"}
            </p>

            <p>
              <strong>GST Number:</strong>{" "}
              {selectedCustomer.gst_number || "N/A"}
            </p>

            <p>
              <strong>Customer Type:</strong>{" "}
              {selectedCustomer.customer_type || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedCustomer.status || "N/A"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {selectedCustomer.address || "N/A"}
            </p>

            <p>
              <strong>Follow-up Date:</strong>{" "}
              {selectedCustomer.follow_up_date
                ? new Date(
                    selectedCustomer.follow_up_date
                  ).toLocaleDateString()
                : "N/A"}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {selectedCustomer.notes || "N/A"}
            </p>
          </div>
        </div>
      )}
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

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
  },

  searchInput: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "250px",
    fontSize: "14px",
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

  actionButtons: {
    display: "flex",
    gap: "6px",
  },

  saveButton: {
    padding: "12px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  viewButton: {
    padding: "7px 12px",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  editButton: {
    padding: "7px 12px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  detailsContainer: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    marginTop: "25px",
    border: "1px solid #ddd",
  },

  detailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  closeButton: {
    padding: "8px 14px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 30px",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};

export default Customers;