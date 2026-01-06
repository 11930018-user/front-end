import React, { useEffect, useState } from "react";
import MenuItem from "../Layouts/MenuItem";

const API_BASE = "web2-project-production.up.railway.app";

axios.get(`${API_BASE}/api/login`);

// --- CartSummary + customer form ---
const CartSummary = ({
  cart,
  adjustQuantity,
  setQuantity,
  totalAmount,
  onPlaceOrder,
  placing,
  customerInfo,
  setCustomerInfo,
  formError,
}) => {
  const TAX_RATE = 0.11;
  const taxAmount = (parseFloat(totalAmount) * TAX_RATE).toFixed(2);
  const finalTotal = (parseFloat(totalAmount) + parseFloat(taxAmount)).toFixed(
    2
  );
  const itemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const CartItem = ({ item }) => (
    <div className="flex justify-between items-center py-1.5">
      <div className="flex-grow pr-2">
        <p className="font-semibold text-xs text-white truncate">
          {item.title}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-gray-300">
          <button
            onClick={() => adjustQuantity(item.id, -1)}
            className="px-1.5 py-0.5 border border-gray-600 rounded text-[9px]"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value || "0", 10);
              if (Number.isNaN(val) || val <= 0) {
                setQuantity(item.id, 1);
              } else {
                setQuantity(item.id, val);
              }
            }}
            className="w-10 bg-black/40 border border-gray-700 rounded px-1 text-[10px] text-center"
          />
          <button
            onClick={() => adjustQuantity(item.id, +1)}
            className="px-1.5 py-0.5 border border-gray-600 rounded text-[9px]"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-200 font-semibold">
        {(item.price * item.quantity).toFixed(2)}$
      </p>
    </div>
  );

  const allInfoFilled =
    customerInfo.first_name.trim() &&
    customerInfo.last_name.trim() &&
    customerInfo.phone.trim() &&
    customerInfo.location.trim();

  const disablePlace = cart.length === 0 || placing || !allInfoFilled;

  return (
    <div className="w-full bg-[#0b0b11]/90 border border-white/10 backdrop-blur-xl p-3 text-white rounded-2xl shadow-xl flex flex-col h-full">
      <div className="border-b border-gray-800 pb-2 mb-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          Order summary
        </p>
        <p className="text-[10px] text-gray-500">
          Enter your details and review items.
        </p>
      </div>

      {/* Customer info */}
      <div className="space-y-2 mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="First name"
            aria-label="First name"
            className="w-1/2 bg-black/40 border border-gray-700 rounded-md px-2 py-1.5 text-[11px] outline-none focus:border-gray-300"
            value={customerInfo.first_name}
            onChange={(e) =>
              setCustomerInfo((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
          />
          <input
            type="text"
            placeholder="Last name"
            aria-label="Last name"
            className="w-1/2 bg-black/40 border border-gray-700 rounded-md px-2 py-1.5 text-[11px] outline-none focus:border-gray-300"
            value={customerInfo.last_name}
            onChange={(e) =>
              setCustomerInfo((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
          />
        </div>
        <input
          type="text"
          placeholder="Phone (e.g. 96176...)"
          aria-label="Phone (e.g. 96176...)"
          className="w-full bg-black/40 border border-gray-700 rounded-md px-2 py-1.5 text-[11px] outline-none focus:border-gray-300"
          value={customerInfo.phone}
          onChange={(e) =>
            setCustomerInfo((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
        />
        <input
          type="text"
          placeholder="Location (street, area...)"
          aria-label="Location (street, area...)"
          className="w-full bg-black/40 border border-gray-700 rounded-md px-2 py-1.5 text-[11px] outline-none focus:border-gray-300"
          value={customerInfo.location}
          onChange={(e) =>
            setCustomerInfo((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
        />
      </div>

      {formError && (
        <p className="text-[10px] text-red-400 mb-1">{formError}</p>
      )}

      <h3 className="font-semibold mb-1 text-xs tracking-wide text-gray-200">
        Items
      </h3>
      <div className="flex-grow overflow-y-auto mb-3 custom-scrollbar pr-1">
        {cart.length === 0 ? (
          <p className="text-gray-500 italic text-[11px]">
            Cart is empty. Tap a dish to add it.
          </p>
        ) : (
          cart.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      <div className="border-t border-gray-800 pt-2 text-[11px] space-y-1">
        <div className="flex justify-between text-gray-300">
          <p>Items ({itemsCount})</p>
          <p className="font-semibold">${totalAmount}</p>
        </div>
        <div className="flex justify-between text-gray-300">
          <p>Tax {(TAX_RATE * 100).toFixed(0)}%</p>
          <p className="font-semibold">${taxAmount}</p>
        </div>

        <div className="flex justify-between items-center mt-2 border-t border-gray-700 pt-2">
          <h4 className="text-[11px] font-semibold">Total</h4>
          <p className="text-base font-bold text-white">${finalTotal}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => adjustQuantity("__clear__", 0)}
            className="border border-gray-600 text-gray-200 hover:bg-gray-800 font-semibold py-2 rounded-lg text-[11px]"
          >
            Clear
          </button>
          <button
            disabled={disablePlace}
            onClick={onPlaceOrder}
            className={`font-semibold py-2 rounded-lg text-[11px] shadow-md ${
              disablePlace
                ? "bg-gray-600/60 text-gray-300 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {placing ? "Placing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [placing, setPlacing] = useState(false);
  const [popup, setPopup] = useState({
    open: false,
    orderId: null,
    total: 0,
  });

  const [customerInfo, setCustomerInfo] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/menu_items`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Could not load menu");
          setMenuItems([]);
          return;
        }

        const items = data.map((row) => ({
          id: row.id,
          category: (row.category || "OTHER").toUpperCase(),
          title: row.name,
          description:
            row.description || "Freshly prepared with quality ingredients.",
          price: Number(row.price),

          // if you switched to local images with image_path:
          img:
            row.image_path && row.image_path.trim() !== ""
              ? `web2-project-production.up.railway.app${row.image_path}`
              : row.image_url && row.image_url.trim() !== ""
              ? row.image_url
              : "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=600",
        }));

        setMenuItems(items);

        const catSet = new Set();
        items.forEach((it) => {
          if (it.category) catSet.add(it.category);
        });
        const catArray = Array.from(catSet);
        setCategories(catArray);
        if (catArray.length > 0) setActiveCategory(catArray[0]);
      } catch (e) {
        console.error("Error fetching menu_items:", e);
        setError("Cannot reach server");
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      if (idx > -1) {
        const next = [...prevCart];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + 1,
        };
        return next;
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const adjustQuantity = (itemId, change) => {
    if (itemId === "__clear__") {
      setCart([]);
      return;
    }

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const setQuantity = (itemId, newQty) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const filteredMenu = menuItems.filter(
    (item) => !activeCategory || item.category.toUpperCase() === activeCategory
  );

  const placeOnlineOrder = async () => {
    if (placing) return;

    if (
      !customerInfo.first_name.trim() ||
      !customerInfo.last_name.trim() ||
      !customerInfo.phone.trim() ||
      !customerInfo.location.trim()
    ) {
      setFormError(
        "first_name, last_name, phone, location and at least one item are required"
      );
      return;
    }

    if (cart.length === 0) {
      setFormError(
        "first_name, last_name, phone, location and at least one item are required"
      );
      return;
    }

    setFormError("");

    try {
      setPlacing(true);

      const payload = {
        first_name: customerInfo.first_name,
        last_name: customerInfo.last_name,
        phone: customerInfo.phone,
        location: customerInfo.location,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: parseFloat(totalAmount),
      };

      const res = await fetch(`${API_URL}/api/online_orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(
          `${data.message || "Could not place online order."} (status ${
            res.status
          })`
        );
        return;
      }

      setPopup({
        open: true,
        orderId: data.online_order_id || data.id,
        total: data.total_amount || totalAmount,
      });

      setCart([]);
      setCustomerInfo({
        first_name: "",
        last_name: "",
        phone: "",
        location: "",
      });
    } catch (e) {
      console.error("Error placing online order:", e);
      setFormError("Cannot reach server. Order not saved.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#050509] via-[#050509] to-black text-white pt-20 pb-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* LEFT: header + categories + smaller grid */}
        <div className="lg:w-3/4 w-full">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
              Upside Down Resto
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">
              Choose your favorite <span className="text-white">dishes</span>
            </h1>
            <p className="text-[11px] md:text-xs text-gray-400 mt-1 max-w-md">
              Browse the live menu straight from the POS system and add items to
              your order in one click.
            </p>
          </header>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 mb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap border transition-colors ${
                  activeCategory === category
                    ? "bg-gray-700 text-white border-gray-500 shadow-md"
                    : "border-white/10 bg:white/5 text-gray-200 hover:border-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-[11px] text-gray-400">Loading menu items...</p>
          )}
          {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}

          {/* Smaller menu cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
            {!loading &&
              filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0c0c12]/90 border border-white/5 rounded-2xl p-3 shadow-md hover:shadow-lg hover:border-white/20 transition-all duration-150 flex flex-col"
                >
                  <MenuItem item={item} onAddToCart={handleAddToCart} />
                </div>
              ))}

            {!loading && filteredMenu.length === 0 && !error && (
              <p className="text-gray-400 col-span-full text-[11px]">
                No items in this category yet.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: summary + form */}
        <div className="lg:w-1/4 w-full">
          <CartSummary
            cart={cart}
            adjustQuantity={adjustQuantity}
            setQuantity={setQuantity}
            totalAmount={totalAmount}
            onPlaceOrder={placeOnlineOrder}
            placing={placing}
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            formError={formError}
          />
        </div>
      </div>

      {/* Popup */}
      {popup.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="bg-[#0b0b11] border border-white/10 rounded-2xl px-6 py-5 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Order placed</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-200 border border-gray-600">
                Online
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Your online order has been created. You will be contacted once it
              is ready. Thank you!!
            </p>

            <div className="bg-black/60 rounded-xl px-4 py-3 mb-4 text-sm border border-white/5">
              <p className="text-gray-300">
                Order number:{" "}
                <span className="font-semibold">#{popup.orderId || "—"}</span>
              </p>
              <p className="text-gray-300 mt-1">
                Total amount:{" "}
                <span className="font-semibold text-white">
                  ${Number(popup.total).toFixed(2)}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setPopup({ open: false, orderId: null, total: 0 })
                }
                className="px-4 py-2 rounded-lg text-xs bg-gray-800 hover:bg-gray-700 text-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Menu;
