// Orders.jsx
import React from "react";
import BottomNav from "../Components/shared/BottomNav";
import { jsPDF } from "jspdf";

const TAX_RATE = 0.0525; // 5.25%

const Orders = () => {
  const [orders, setOrders] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("open");
  const [loading, setLoading] = React.useState(true);

  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = React.useState([]);
  const [itemsLoading, setItemsLoading] = React.useState(false);

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "web2-project-production.up.railway.app/api/orders"
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        setOrders([]);
      } else {
        setOrders(data);
      }
    } catch (e) {
      console.error("Error loading orders", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrderItems = React.useCallback(async (orderId) => {
    const res = await fetch(
      `web2-project-production.up.railway.app/api/orders/${orderId}/items`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to load items");
    }
    return data;
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
    const firstOpen = orders.find((o) => o.status === "open");
    if (firstOpen) {
      handleSelectOrder(firstOpen);
    } else {
      setSelectedOrder(null);
      setSelectedOrderItems([]);
    }
  }, [orders, handleSelectOrder]);

  const printReceipt = async (order) => {
    try {
      const items = await fetchOrderItems(order.id);

      const subtotal = Number(order.total_amount || 0);
      const tax = +(subtotal * TAX_RATE).toFixed(2);
      const totalWithTax = +(subtotal + tax).toFixed(2);

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Order Receipt", 14, 20);

      doc.setFontSize(12);
      doc.text(`Order #${order.id}`, 14, 30);
      doc.text(`Table: ${order.table_number}`, 14, 36);
      doc.text(
        `By: ${order.first_name || ""} ${order.last_name || ""}`.trim(),
        14,
        42
      );
      doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 14, 48);
      doc.text(`Status: ${order.status}`, 14, 54);
      doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 14, 60);
      doc.text(`Tax (5.25%): $${tax.toFixed(2)}`, 14, 66);
      doc.text(`Total: $${totalWithTax.toFixed(2)}`, 14, 72);

      let y = 84;
      doc.text("Items:", 14, y);
      y += 8;

      items.forEach((item) => {
        const name = item.name || item.item_name || "Item";
        const qty = item.quantity ?? item.qty ?? 1;
        const price = item.price ?? item.unit_price ?? 0;
        doc.text(`${name} x${qty} - $${Number(price * qty).toFixed(2)}`, 14, y);
        y += 6;
      });

      doc.save(`receipt-${order.id}.pdf`);
    } catch (err) {
      console.error("Print error:", err);
    }
  };

  // helper to free a table (same idea as when you delete an order)
  const freeTable = async (tableId) => {
    if (!tableId) return;
    await fetch(
      `web2-project-production.up.railway.app/api/restaurant_tables/${tableId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "available" }),
      }
    );
  };

  // Mark order as done AND free table
  const updateStatus = async (id, tableId) => {
    await fetch(`web2-project-production.up.railway.app/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });

    // free the table when order is done
    await freeTable(tableId);

    fetchOrders();
  };

  const deleteOrder = async (id, tableId) => {
    if (!window.confirm("Delete order?")) return;

    await fetch(`web2-project-production.up.railway.app/api/orders/${id}`, {
      method: "DELETE",
    });

    // free table on delete as you already do
    await freeTable(tableId);

    fetchOrders();
  };

  const filtered = orders.filter((o) =>
    activeTab === "open" ? o.status === "open" : o.status !== "open"
  );

  const formatTotalWithTax = (order) => {
    const subtotal = Number(order.total_amount || 0);
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const totalWithTax = +(subtotal + tax).toFixed(2);
    return totalWithTax.toFixed(2);
  };

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
        `web2-project-production.up.railway.app/api/orders/${selectedOrder.id}/items`,
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

      alert("Order updated successfully");
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert("Cannot reach server");
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Tabs */}
      <header className="p-4 flex gap-2">
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
      </header>

      <div className="flex-1 flex gap-4 p-4">
        {/* LEFT: orders list */}
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
              <p>Table {order.table_number}</p>
              <p>Total (with tax): ${formatTotalWithTax(order)}</p>

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

                {order.status === "open" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // must exist in API response
                      updateStatus(order.id, order.table_id);
                    }}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Mark Done
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order.id, order.table_id);
                  }}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: selected order details + items */}
        <div className="hidden md:flex flex-col w-1/2 bg-gray-800 rounded p-4">
          {!selectedOrder ? (
            <p className="text-gray-300">Select an order to view details.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Order #{selectedOrder.id} details
              </h2>
              <p>Table: {selectedOrder.table_number}</p>
              <p>
                By: {selectedOrder.first_name} {selectedOrder.last_name}
              </p>
              <p>Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p>Status: {selectedOrder.status}</p>

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

export default Orders;
