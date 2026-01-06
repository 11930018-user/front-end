import React from "react";
import BottomNav from "../Components/shared/BottomNav";
import BackButton from "../Components/shared/BackButton";
import { FaPizzaSlice } from "react-icons/fa";
import { GiChickenOven, GiWineBottle, GiSpoon } from "react-icons/gi";
import { BiSolidDrink } from "react-icons/bi";
import { MdOutlineIcecream } from "react-icons/md";
import { TbSalad } from "react-icons/tb";
import { PiHamburger } from "react-icons/pi";
import { LuSandwich, LuHandPlatter } from "react-icons/lu";
import { useLocation } from "react-router-dom";

const TAX_RATE = 0.0525;

// map DB categories -> icons + colors
const CATEGORY_META = {
  Starters: { color: "bg-red-600", icon: <GiSpoon /> },
  "Main Course": { color: "bg-purple-600", icon: <PiHamburger /> },
  Burgers: { color: "bg-purple-600", icon: <PiHamburger /> },
  Sandwiches: { color: "bg-yellow-800", icon: <LuSandwich /> },
  Pizzas: { color: "bg-green-700", icon: <FaPizzaSlice /> },
  Platters: { color: "bg-red-700", icon: <LuHandPlatter /> },
  Salads: { color: "bg-indigo-700", icon: <TbSalad /> },
  Beverages: { color: "bg-fuchsia-700", icon: <BiSolidDrink /> },
  Desserts: { color: "bg-blue-800", icon: <MdOutlineIcecream /> },
  Alcohol: { color: "bg-emerald-700", icon: <GiWineBottle /> },
  Other: { color: "bg-gray-700", icon: <GiChickenOven /> },
};

const Menu = () => {
  const location = useLocation();
  const tableId = location.state?.tableId || 1;
  const tableNumber = location.state?.tableNumber || tableId;
  const tableZone = location.state?.zone || "";

  const [itemsState, setItemsState] = React.useState([]); // { id, name, price, category, description, qty }
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [lastClickedId, setLastClickedId] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const [form, setForm] = React.useState({
    id: null,
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [isEditing, setIsEditing] = React.useState(false);

  // popup state after placing order
  const [orderModal, setOrderModal] = React.useState({
    open: false,
    orderId: null,
    total: 0,
  });

  // load menu items from backend
  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "web2-project-production.up.railway.app/api/menu_items"
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Could not load menu");
          return;
        }

        const activeItems = data
          .filter((it) => it.is_active === 1 || it.is_active === true)
          .map((it) => ({
            id: it.id,
            name: it.name,
            price: Number(it.price),
            category: it.category || "Other",
            description: it.description || "",
            qty: 0,
          }));

        setItemsState(activeItems);

        const catMap = new Map();
        activeItems.forEach((it) => {
          const cat = it.category || "Other";
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
        });

        const catArray = Array.from(catMap.entries()).map(([name, count]) => {
          const meta = CATEGORY_META[name] || CATEGORY_META.Other;
          return {
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            items: count,
            color: meta.color,
            icon: meta.icon,
          };
        });

        setCategories(catArray);
        if (catArray.length > 0) {
          setSelectedCategory(catArray[0].id);
        }
      } catch {
        setError("Cannot reach server");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // filter items by category
  const filteredItems = itemsState.filter((i) => {
    if (!selectedCategory) return true;
    const catObj = categories.find((c) => c.id === selectedCategory);
    if (!catObj) return true;
    return i.category === catObj.name;
  });

  // card click -> +1
  const handleCardClick = (itemId) => {
    setItemsState((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, qty: it.qty + 1 } : it))
    );
    setLastClickedId(itemId);
  };

  const changeQty = (itemId, delta) => {
    setItemsState((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const newQty = Math.max(0, it.qty + delta);
        return { ...it, qty: newQty };
      })
    );
  };

  const orderItems = itemsState.filter((it) => it.qty > 0);
  const subtotal = orderItems.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setForm({
      id: null,
      name: "",
      price: "",
      category: "",
      description: "",
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required.");
      return;
    }

    try {
      const res = await fetch(
        "web2-project-production.up.railway.app/api/menu_items",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            price: Number(form.price),
            category: form.category,
            description: form.description,
            is_active: 1,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not create item");
        return;
      }

      setItemsState((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          price: Number(data.price),
          category: data.category,
          description: data.description || "",
          qty: 0,
        },
      ]);

      resetForm();
    } catch {
      setError("Cannot reach server");
    }
  };

  const startEditItem = (item) => {
    setIsEditing(true);
    setForm({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || "",
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.id) return;
    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required.");
      return;
    }

    try {
      const res = await fetch(
        `web2-project-production.up.railway.app/api/menu_items/${form.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            price: Number(form.price),
            category: form.category,
            description: form.description,
            is_active: 1,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not update item");
        return;
      }

      setItemsState((prev) =>
        prev.map((it) =>
          it.id === form.id
            ? {
                ...it,
                name: data.name,
                price: Number(data.price),
                category: data.category,
                description: data.description || "",
              }
            : it
        )
      );

      resetForm();
    } catch {
      setError("Cannot reach server");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    setError("");

    try {
      const res = await fetch(
        `web2-project-production.up.railway.app/api/menu_items/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not delete item");
        return;
      }

      setItemsState((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setError("Cannot reach server");
    }
  };

  // FIXED placeOrder
  const placeOrder = async () => {
    if (orderItems.length === 0) {
      return;
    }

    const storedEmp = localStorage.getItem("employee");
    if (!storedEmp) {
      alert("No employee logged in.");
      return;
    }
    const employee = JSON.parse(storedEmp);

    const payload = {
      table_id: tableId,
      employee_id: employee.id,
      items: orderItems.map((it) => ({
        menu_item_id: it.id,
        quantity: it.qty,
        price: it.price,
      })),
    };

    try {
      const res = await fetch(
        "web2-project-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // try to parse JSON, but don't crash if it's not JSON
      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.warn("placeOrder: response is not valid JSON", err);
      }

      if (!res.ok) {
        const msg =
          (data && data.message) ||
          `Could not place order (status ${res.status})`;
        alert(msg);
        return;
      }

      // open themed popup in center
      setOrderModal({
        open: true,
        orderId: data?.order_id ?? null,
        total: data?.total_amount ?? total,
      });

      // clear cart
      setItemsState((prev) => prev.map((it) => ({ ...it, qty: 0 })));
    } catch (err) {
      console.error("placeOrder error:", err);
      alert("Cannot reach server. Order not saved.");
    }
  };

  return (
    <section className="min-h-screen bg-[#121212] text-white flex flex-col pb-20">
      {/* Top bar */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-lg font-semibold">Menu</h1>
          <p className="text-xs text-gray-400">
            Table #{tableNumber}
            {tableZone ? ` • ${tableZone}` : ""} / Dine in
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 pt-3 max-w-6xl w_full mx-auto">
        {/* LEFT: categories + items + form */}
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          {error && (
            <p className="text-xs text-red-400 bg-red-900/30 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {/* Add / Edit Item Form */}
          <form
            onSubmit={isEditing ? handleUpdateItem : handleAddItem}
            className="bg-[#1c1c1c] rounded-2xl p-3 flex flex-wrap gap-3 items-end text-sm"
          >
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded w-full"
                placeholder="Item name"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs mb-1">Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleFormChange}
                className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded w-full"
                placeholder="0.00"
              />
            </div>
            <div className="w-40">
              <label className="block text-xs mb-1">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded w-full"
                placeholder="e.g. Starters"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs mb-1">Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded w-full"
                placeholder="Short description"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-1 rounded-lg text-xs"
              >
                {isEditing ? "Save" : "Add Item"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {loading && (
            <p className="text-xs text-gray-300">Loading menu items...</p>
          )}

          {/* Categories row (pills) */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs ${
                  selectedCategory === cat.id
                    ? "bg-yellow-500 text-black"
                    : "bg-[#1c1c1c] text-gray-300"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80">({cat.items})</span>
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {!loading &&
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item.id)}
                  className={`bg-[#1c1c1c] rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition ${
                    lastClickedId === item.id ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {item.description || "No description"}
                    </p>
                    <p className="text-sm font-bold text-yellow-400">
                      ${item.price}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 flex items-center justify-between bg-black/70 rounded-lg px-3 py-2 text-xs"
                  >
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      disabled={item.qty === 0}
                      className={`text-yellow-400 text-lg ${
                        item.qty === 0 ? "opacity-40 cursor-not-allowed" : ""
                      }`}
                    >
                      -
                    </button>
                    <span className="text-white text-sm font-semibold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="text-yellow-400 text-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-2 flex justify-end gap-1 text-[10px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditItem(item);
                      }}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}

            {!loading && filteredItems.length === 0 && !error && (
              <p className="text-gray-400 col-span-full text-xs">
                No items in this category.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: order panel */}
        <div className="w-full md:w-1/3 bg-[#1c1c1c] rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold">Current order</h2>
              <p className="text-xs text-gray-400">
                Table #{tableNumber}
                {tableZone ? ` • ${tableZone}` : ""} / Dine in
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {orderItems.reduce((a, b) => a + b.qty, 0)} item(s)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {orderItems.length === 0 ? (
              <p className="text-xs text-gray-400">
                No items yet. Click a card to add.
              </p>
            ) : (
              orderItems.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between bg-[#252525] rounded-xl px-3 py-2 text-xs"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-semibold">{it.name}</p>
                    <p className="text-gray-400">
                      ${it.price} x {it.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => changeQty(it.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{it.qty}</span>
                    <button
                      onClick={() => changeQty(it.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-500 text-black"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 border-t border-gray-700 pt-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-300">Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Tax (5.25%)</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                disabled={orderItems.length === 0}
                onClick={placeOrder}
                className={`px-3 py-2 rounded-md text-xs ${
                  orderItems.length === 0
                    ? "bg-yellow-300/40 text_black cursor-not-allowed"
                    : "bg-yellow-600"
                }`}
              >
                Place
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky summary */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-[#141414] p-3 rounded-xl text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">
              Items ({orderItems.reduce((a, b) => a + b.qty, 0)})
            </div>
            <div className="font-bold">${total}</div>
          </div>
          <div className="flex gap-2">
            <button
              disabled={orderItems.length === 0}
              onClick={placeOrder}
              className={`px-3 py-2 rounded-md ${
                orderItems.length === 0
                  ? "bg-yellow-300/40 text-black cursor-not-allowed"
                  : "bg-yellow-600"
              }`}
            >
              Place
            </button>
          </div>
        </div>
      </div>

      {/* Centered order modal */}
      {orderModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1c1c1c] border border-gray-700 rounded-2xl px-6 py-5 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-1">
              Order placed
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Table #{tableNumber}
              {tableZone ? ` • ${tableZone}` : ""} / Dine in
            </p>

            <div className="bg-[#111] rounded-xl px-4 py-3 mb-4 text-sm">
              <p className="text-gray-300">
                Order ID:{" "}
                <span className="font-semibold">#{orderModal.orderId}</span>
              </p>
              <p className="text-gray-300 mt-1">
                Total:{" "}
                <span className="font-semibold text-yellow-400">
                  ${Number(orderModal.total).toFixed(2)}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setOrderModal({ open: false, orderId: null, total: 0 })
                }
                className="px-3 py-1.5 rounded-md text-xs bg-gray-700 hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </section>
  );
};

export default Menu;
