// Tables.jsx
import React, { useState, useEffect } from "react";
import BottomNav from "../Components/shared/BottomNav";
import TableCard from "../Components/tables/TableCard";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    table_number: "",
    capacity: "",
    status: "available",
    zone: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // load tables from backend
  const fetchTables = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        "web2-project-production.up.railway.app/api/restaurant_tables"
      );
      if (!res.ok) {
        throw new Error("Failed to load tables");
      }
      const data = await res.json();
      setTables(data);
    } catch (err) {
      setError(err.message || "Something went wrong loading tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      table_number: "",
      capacity: "",
      status: "available",
      zone: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      table_number: form.table_number,
      capacity: Number(form.capacity),
      status: form.status,
      zone: form.zone || null,
    };

    try {
      setError("");

      if (isEditing && form.id) {
        // update existing table
        const res = await fetch(
          `web2-project-production.up.railway.app/api/restaurant_tables/${form.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to update table");
        }
      } else {
        // create new table
        const res = await fetch(
          "web2-project-production.up.railway.app/api/restaurant_tables",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to add table");
        }
      }

      await fetchTables();
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save table");
    }
  };

  const startEdit = (table) => {
    setForm({
      id: table.id,
      table_number: table.table_number,
      capacity: table.capacity,
      status: table.status,
      zone: table.zone || "",
    });
    setIsEditing(true);
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm("Delete this table?")) return;

    try {
      const res = await fetch(
        `web2-project-production.up.railway.app/api/restaurant_tables/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete table");
      }

      await fetchTables();
    } catch (err) {
      setError(err.message || "Failed to delete table");
    }
  };

  // filter: "All" shows all, "Occupied" shows only reserved tables
  const filteredTables =
    filter === "All"
      ? tables
      : tables.filter((t) => t.status && t.status.toLowerCase() === "reserved");

  return (
    <section className="min-h-screen bg-[#121212] text-white flex flex-col pb-20">
      <div className="px-4 pt-4 flex-1 max-w-5xl w-full mx-auto">
        {/* Header + filter tabs */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Tables</h1>
          <div className="flex gap-2 bg-[#1e1e1e] rounded-full p-1">
            <button
              onClick={() => setFilter("All")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "All" ? "bg-yellow-500 text-black" : "text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Occupied")}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === "Occupied"
                  ? "bg-yellow-500 text-black"
                  : "text-gray-300"
              }`}
            >
              Occupied
            </button>
          </div>
        </div>

        {/* Error / loading */}
        {error && (
          <p className="mb-3 text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded">
            {error}
          </p>
        )}
        {loading && <p className="mb-3 text-sm text-gray-300">Loading...</p>}

        {/* Add / edit form */}
        <form
          onSubmit={handleSubmit}
          className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-2 bg-[#1c1c1c] p-3 rounded-xl"
        >
          <input
            type="number"
            name="table_number"
            value={form.table_number}
            onChange={handleChange}
            placeholder="Table #"
            className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded"
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
          </select>
          <input
            type="text"
            name="zone"
            value={form.zone}
            onChange={handleChange}
            placeholder="Zone (Zone 1)"
            className="bg-[#111] border border-gray-700 text-sm px-2 py-1 rounded"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold px-3 py-1 rounded"
            >
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Tables grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="bg-[#1c1c1c] rounded-2xl p-3 flex flex-col justify-between"
            >
              <TableCard
                table={{
                  id: table.id,
                  // circle name: zone if set, otherwise Table X
                  name: table.zone || `Table ${table.table_number}`,
                  status:
                    table.status && table.status.toLowerCase() === "reserved"
                      ? "Reserved"
                      : "Available",
                  // color: yellow when reserved, gray when available
                  color:
                    table.status && table.status.toLowerCase() === "reserved"
                      ? "bg-yellow-600"
                      : "bg-gray-600",
                }}
              />

              <div className="mt-2 flex justify-between items-center text-[11px] text-gray-300">
                <div className="space-y-0.5">
                  <p>
                    Table #{table.table_number} • Cap: {table.capacity}
                  </p>
                  <p>Zone: {table.zone || "—"}</p>
                  <p>Status: {table.status}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => startEdit(table)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
