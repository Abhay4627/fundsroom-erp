import { useEffect, useState } from "react";
import Customers from "./pages/Customers";
import Products from "./Products";
import Inventory from "./pages/Inventory";
import SalesChallans from "./pages/SalesChallans";
import StockMovements from "./pages/StockMovements";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("dashboard");

  const [dashboardData, setDashboardData] = useState({
    customers: 0,
    products: 0,
    stock: 0,
    challans: 0,
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://fundsroom-erp-9ro1.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setLoggedIn(true);
      setMessage("");
    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  useEffect(() => {
    if (!loggedIn) return;

    const fetchDashboardData = async () => {
      try {
        const [customersResponse, productsResponse, challansResponse] =
          await Promise.all([
            fetch("https://fundsroom-erp-9r01.onrender.com/customers"),
            fetch("https://fundsroom-erp-9r01.onrender.com/products"),
            fetch("https://fundsroom-erp-9r01.onrender.com/challans"),
          ]);

        const customers = await customersResponse.json();
        const products = await productsResponse.json();
        const challans = await challansResponse.json();

        const totalStock = products.reduce(
          (total, product) => total + Number(product.current_stock || 0),
          0
        );

        setDashboardData({
          customers: customers.length,
          products: products.length,
          stock: totalStock,
          challans: challans.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [loggedIn]);

  if (loggedIn) {
    return (
      <div style={styles.dashboard}>
        <aside style={styles.sidebar}>
          <h2>Fundsroom ERP</h2>

          <div
            style={styles.menu}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </div>

          <div
            style={styles.menu}
            onClick={() => setPage("customers")}
          >
            Customers
          </div>

          <div
            style={styles.menu}
            onClick={() => setPage("products")}
          >
            Products
          </div>

          <div
            style={styles.menu}
            onClick={() => setPage("inventory")}
          >
            Inventory
          </div>

          <div
            style={styles.menu}
            onClick={() => setPage("challans")}
          >
            Sales Challans
          </div>

          <div
            style={styles.menu}
            onClick={() => setPage("stock-movements")}
          >
            Stock Movements
          </div>

          <button
            style={styles.logout}
            onClick={() => {
              localStorage.clear();
              setLoggedIn(false);
              setUser(null);
            }}
          >
            Logout
          </button>
        </aside>

        <main style={styles.main}>
          {page === "dashboard" && (
            <>
              <h1>Dashboard</h1>

              <p>
                Welcome, <strong>{user?.name}</strong>
              </p>

              <div style={styles.cards}>
                <div style={styles.card}>
                  <h3>Customers</h3>
                  <h2>{dashboardData.customers}</h2>
                  <p>CRM Management</p>
                </div>

                <div style={styles.card}>
                  <h3>Products</h3>
                  <h2>{dashboardData.products}</h2>
                  <p>Product Management</p>
                </div>

                <div style={styles.card}>
                  <h3>Current Stock</h3>
                  <h2>{dashboardData.stock}</h2>
                  <p>Total available units</p>
                </div>

                <div style={styles.card}>
                  <h3>Sales Challans</h3>
                  <h2>{dashboardData.challans}</h2>
                  <p>Sales Management</p>
                </div>
              </div>
            </>
          )}

          {page === "customers" && <Customers />}

          {page === "products" && <Products />}

          {page === "inventory" && <Inventory />}

          {page === "challans" && <SalesChallans />}

          {page === "stock-movements" && <StockMovements />}
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.loginCard}>
        <h1>Fundsroom ERP</h1>
        <p>Mini ERP + CRM Operations Portal</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },

  loginCard: {
    width: "380px",
    padding: "35px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "18px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#222",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  dashboard: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6f8",
  },

  sidebar: {
    width: "230px",
    background: "#222",
    color: "white",
    padding: "25px",
  },

  menu: {
    padding: "15px 5px",
    cursor: "pointer",
  },

  logout: {
    marginTop: "30px",
    padding: "10px",
    width: "100%",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "40px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
};

export default App;