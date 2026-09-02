import { useEffect, useState } from "react";

const API_URL = "https://fundsroom-erp-9ro1.onrender.com";

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const canManageProducts =
    user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  const emptyForm = {
    product_name: "",
    sku: "",
    category: "",
    unit_price: "",
    current_stock: 0,
    minimum_stock_quantity: 0,
    warehouse_location: "",
  };

  const [form, setForm] = useState(emptyForm);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch products");
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
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

      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: form.product_name,
          sku: form.sku,
          category: form.category,
          unit_price: Number(form.unit_price),
          current_stock: Number(form.current_stock),
          minimum_stock_quantity: Number(
            form.minimum_stock_quantity
          ),
          warehouse_location: form.warehouse_location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save product");
        return;
      }

      alert(
        editingProduct
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      setForm(emptyForm);
      setEditingProduct(null);
      setShowForm(false);

      fetchProducts();
    } catch (error) {
      alert("Unable to connect to backend");
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      product_name: product.product_name || "",
      sku: product.sku || "",
      category: product.category || "",
      unit_price: product.unit_price || "",
      current_stock: product.current_stock || 0,
      minimum_stock_quantity:
        product.minimum_stock_quantity || 0,
      warehouse_location: product.warehouse_location || "",
    });

    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.product_name
        ?.toLowerCase()
        .includes(searchText) ||
      product.sku?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Manage products and inventory stock</p>
        </div>

        {canManageProducts && (
          <button
            onClick={showForm ? handleClose : handleAdd}
            style={styles.addButton}
          >
            {showForm ? "Close Form" : "+ Add Product"}
          </button>
        )}
      </div>

      {showForm && canManageProducts && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          <input
            name="product_name"
            placeholder="Product Name"
            value={form.product_name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="unit_price"
            type="number"
            min="0"
            placeholder="Unit Price"
            value={form.unit_price}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="current_stock"
            type="number"
            min="0"
            placeholder="Current Stock"
            value={form.current_stock}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="minimum_stock_quantity"
            type="number"
            min="0"
            placeholder="Minimum Stock Quantity"
            value={form.minimum_stock_quantity}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="warehouse_location"
            placeholder="Warehouse Location"
            value={form.warehouse_location}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.saveButton}>
            {editingProduct ? "Update Product" : "Save Product"}
          </button>
        </form>
      )}

      <div style={styles.container}>
        <div style={styles.listHeader}>
          <h2>Product List</h2>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Minimum Stock</th>
              <th style={styles.th}>Location</th>

              {canManageProducts && (
                <th style={styles.th}>Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td style={styles.td}>{product.id}</td>
                <td style={styles.td}>{product.product_name}</td>
                <td style={styles.td}>{product.sku}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>
                  ₹{product.unit_price}
                </td>
                <td style={styles.td}>
                  {product.current_stock}
                </td>
                <td style={styles.td}>
                  {product.minimum_stock_quantity}
                </td>
                <td style={styles.td}>
                  {product.warehouse_location}
                </td>

                {canManageProducts && (
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <p style={styles.empty}>No products found.</p>
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

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  searchInput: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "250px",
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

  editButton: {
    padding: "7px 12px",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};

export default Products;