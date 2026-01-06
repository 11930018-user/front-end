// OrdersOnline.jsx
import React from "react";
import BottomNav from "../Components/shared/BottomNav";
import { jsPDF } from "jspdf";

const TAX_RATE = 0.0525; // 5.25%
const OPEN_STATUSES = ["pending", "accepted", "preparing", "out_for_delivery"];

const OrdersOnline = () => {
  const [orders, setOrders] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("open");
  const [loading, setLoading] = React.useState(true);

  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = React.useState([]);
  const [itemsLoading, setItemsLoading] = React.useState(false);

  // ===== FETCH ONLINE ORDERS (ONLINE_ORDERS TABLE) =====
  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "web2-project-production.up.railway.app/api/online_orders"
      );
      const data = await res.json();
      console.log("online_orders:", data); // DEBUG
      if (!res.ok) {
        console.error(data);
        setOrders([]);
      } else {
        setOrders(data);
      }
    } catch (e) {
      console.error("Error loading online orders", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // polling: auto-refresh list every 5 seconds
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  // ===== FETCH ONLINE ORDER ITEMS =====
  const fetchOrderItems = React.useCallback(async (orderId) => {
    const res = await fetch(
      `web2-project-production.up.railway.app/api/online_orders/${orderId}/items`
    );
    const data = await res.json();
    console.log("online order items raw for", orderId, data); // DEBUG
    if (!res.ok) {
      throw new Error(data.message || "Failed to load items");
    }

    // normalize: make sure price and quantity are numbers
    return data.map((it) => ({
      ...it,
      menu_item_id: it.menu_item_id,
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 0,
    }));
  }, []);

  const handleSelectOrder = React.useCallback(
    async (order) => {
      if (!order) return;
      setSelectedOrder(order);
      setItemsLoading(true);
      try {
        const items = await fetchOrderItems(order.id);
        setSelectedOrderItems(items);
      } catch (e) {
        console.error("Error loading order items", e);
        setSelectedOrderItems([]);
      } finally {
        setItemsLoading(false);
      }
    },
    [fetchOrderItems]
  );

  React.useEffect(() => {
    if (orders.length === 0) {
      setSelectedOrder(null);
      setSelectedOrderItems([]);
      return;
    }
    const firstOpen = orders.find((o) =>
      OPEN_STATUSES.includes((o.status || "").toLowerCase())
    );
    if (firstOpen) {
      handleSelectOrder(firstOpen);
    } else {
      setSelectedOrder(null);
      setSelectedOrderItems([]);
    }
  }, [orders, handleSelectOrder]);

  // ===== PRINT RECEIPT FOR ONLINE ORDER =====
  const printReceipt = async (order) => {
    try {
      const items = await fetchOrderItems(order.id);

      const subtotal =
        Number(order.total_amount || 0) - Number(order.tax_amount || 0);
      const tax = Number(order.tax_amount || 0);
      const totalWithTax = Number(order.total_amount || 0);

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Online Order Receipt", 14, 20);

      doc.setFontSize(12);
      doc.text(`Order #${order.id}`, 14, 30);
      doc.text(
        `Customer: ${order.customer_first_name || ""} ${
          order.customer_last_name || ""
        }`.trim(),
        14,
        36
      );
      doc.text(`Phone: ${order.customer_phone || ""}`, 14, 42);
      doc.text(`Location: ${order.customer_location || ""}`, 14, 48);
      doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 14, 54);
      doc.text(`Status: ${order.status}`, 14, 60);
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 14, 66);
      doc.text(`Tax: $${tax.toFixed(2)}`, 14, 72);
      doc.text(`Total: $${totalWithTax.toFixed(2)}`, 14, 78);

      let y = 90;
      doc.text("Items:", 14, y);
      y += 8;

      items.forEach((item) => {
        const name = item.name || item.item_name || "Item";
        const qty = item.quantity ?? item.qty ?? 1;
        const price = item.price ?? item.unit_price ?? 0;
        doc.text(`${name} x${qty} - $${Number(price * qty).toFixed(2)}`, 14, y);
        y += 6;
      });

      doc.save(`online-receipt-${order.id}.pdf`);
    } catch (err) {
      console.error("Print error:", err);
    }
  };

  // ===== UPDATE / DELETE ONLINE ORDER =====
  const updateOnlineOrderStatus = async (id, newStatus) => {
    await fetch(`web2-project-production.up.railway.app/api/online_orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        payment_status: newStatus === "delivered" ? "paid" : undefined,
      }),
    });
    await fetchOrders();
  };

  const deleteOnlineOrder = async (id) => {
    if (!window.confirm("Delete online order?")) return;
    await fetch(`web2-project-production.up.railway.app/api/online_orders/${id}`, {
      method: "DELETE",
    });
    fetchOrders();
  };

  // open vs history
  const filtered = orders.filter((o) =>
    activeTab === "open"
      ? OPEN_STATUSES.includes((o.status || "").toLowerCase())
      : !OPEN_STATUSES.includes((o.status || "").toLowerCase())
  );

  const changeSelectedItemQty = (itemId, delta) => {
    setSelectedOrderItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, quantity: Math.max(0, (it.quantity || 0) + delta) }
          : it
      )
    );
  };

  const recomputeSelectedTotals = () => {
    const subtotal = selectedOrderItems.reduce(
      (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
      0
    );
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const totalWithTax = +(subtotal + tax).toFixed(2);
    return { subtotal, tax, totalWithTax };
  };

  const selectedTotals = selectedOrder
    ? recomputeSelectedTotals()
    : { subtotal: 0, tax: 0, totalWithTax: 0 };

  // ===== SAVE SELECTED ORDER CHANGES (UPDATE / REMOVE ITEMS) =====
  const saveSelectedOrderChanges = async () => {
    if (!selectedOrder) return;

    const itemsPayload = selectedOrderItems
      .filter((it) => (it.quantity || 0) > 0)
      .map((it) => ({
        menu_item_id: it.menu_item_id,
        quantity: it.quantity,
        price: it.price,
      }));

    try {
      const res = await fetch(
        `web2-project-production.up.railway.app/api/online_orders/${selectedOrder.id}/items`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: itemsPayload }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not save changes");
        return;
      }

      console.log("updated online order totals:", data);
      alert("Online order updated successfully");

      const freshItems = await fetchOrderItems(selectedOrder.id);
      setSelectedOrderItems(freshItems);
      await fetchOrders();

      setSelectedOrder((prev) => {
        if (!prev) return prev;
        const updated = orders.find((o) => o.id === prev.id);
        return updated || prev;
      });
    } catch (e) {
      console.error(e);
      alert("Cannot reach server");
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white flex flex-col pb-20">
      {/* Tabs */}
      <header className="p-4 flex gap-2 items-center">
        <button
          onClick={() => setActiveTab("open")}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === "open"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === "history"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-200"
          }`}
        >
          History
        </button>
        {/* Manual refresh button (optional) */}
        <button
          onClick={fetchOrders}
          className="ml-auto px-3 py-1 rounded text-sm bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          Refresh
        </button>
      </header>

      <div className="flex-1 flex gap-4 p-4">
        {/* LEFT: online orders list */}
        <div className="w-full md:w-1/2 space-y-3">
          {loading && <p>Loading...</p>}

          {filtered.map((order) => (
            <div
              key={order.id}
              className={`bg-gray-800 p-3 rounded cursor-pointer ${
                selectedOrder && selectedOrder.id === order.id
                  ? "ring-2 ring-yellow-500"
                  : ""
              }`}
              onClick={() => handleSelectOrder(order)}
            >
              <p className="font-semibold">Order #{order.id}</p>
              <p>
                Customer: {order.customer_first_name} {order.customer_last_name}
              </p>
              <p>Phone: {order.customer_phone}</p>
              <p>Location: {order.customer_location}</p>
              <p>Status: {order.status}</p>
              <p>Payment: {order.payment_status}</p>
              <p>Total: ${Number(order.total_amount || 0).toFixed(2)}</p>

              <div className="mt-2 flex flex-wrap justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    printReceipt(order);
                  }}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Print Receipt
                </button>

                {OPEN_STATUSES.includes((order.status || "").toLowerCase()) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOnlineOrderStatus(order.id, "delivered");
                    }}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Mark Delivered
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOnlineOrder(order.id);
                  }}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: selected online order details + items */}
        <div className="hidden md:flex flex-col w-1/2 bg-gray-800 rounded p-4">
          {!selectedOrder ? (
            <p className="text-gray-300">
              Select an online order to view details.
            </p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Online Order #{selectedOrder.id} details
              </h2>
              <p>
                Customer: {selectedOrder.customer_first_name}{" "}
                {selectedOrder.customer_last_name}
              </p>
              <p>Phone: {selectedOrder.customer_phone}</p>
              <p>Location: {selectedOrder.customer_location}</p>
              <p>Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p>Status: {selectedOrder.status}</p>
              <p>Payment: {selectedOrder.payment_status}</p>
              <p>Delivery: {selectedOrder.delivery_type}</p>

              <h3 className="mt-4 mb-2 font-semibold">Items</h3>
              {itemsLoading ? (
                <p>Loading items...</p>
              ) : selectedOrderItems.length === 0 ? (
                <p className="text-gray-400">No items.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {selectedOrderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-900 px-3 py-2 rounded"
                    >
                      <div>
                        <p className="font-medium">
                          {item.name || item.item_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ${Number(item.price || 0).toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeSelectedItemQty(item.id, -1)}
                          className="px-2 py-1 bg-gray-700 rounded text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">
                          {item.quantity || 0}
                        </span>
                        <button
                          onClick={() => changeSelectedItemQty(item.id, +1)}
                          className="px-2 py-1 bg-gray-700 rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p>
                          $
                          {((item.price || 0) * (item.quantity || 0)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t border-gray-700 pt-3">
                <p>Subtotal: ${selectedTotals.subtotal.toFixed(2)}</p>
                <p>Tax (5.25%): ${selectedTotals.tax.toFixed(2)}</p>
                <p className="font-semibold">
                  Total: ${selectedTotals.totalWithTax.toFixed(2)}
                </p>

                <button
                  onClick={saveSelectedOrderChanges}
                  className="mt-3 px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default OrdersOnline;
