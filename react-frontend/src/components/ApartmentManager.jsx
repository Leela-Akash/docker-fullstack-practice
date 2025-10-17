import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

// Use environment variable for host + port
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/apartments`;

const ApartmentManager = () => {
  const [apartments, setApartments] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", rent: "", status: "Available" });
  const [editId, setEditId] = useState(null);

  // Fetch all apartments
  const fetchApartments = async () => {
    try {
      const res = await axios.get(API_URL);
      setApartments(res.data);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: "", location: "", rent: "", status: "Available" });
      setEditId(null);
      fetchApartments();
    } catch (error) {
      console.error("Error saving apartment:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchApartments();
    } catch (error) {
      console.error("Error deleting apartment:", error);
    }
  };

  // Handle edit
  const handleEdit = (apt) => {
    setForm({ name: apt.name, location: apt.location, rent: apt.rent, status: apt.status });
    setEditId(apt.id);
  };

  // Toggle status Available / Occupied
  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle-status`);
      fetchApartments();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="container">
      <h2>RentWise – Apartments</h2>

      <form onSubmit={handleSubmit} className="apartment-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={form.rent}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Available</option>
          <option>Occupied</option>
        </select>
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Rent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map((apt) => (
            <tr key={apt.id}>
              <td>{apt.id}</td>
              <td>{apt.name}</td>
              <td>{apt.location}</td>
              <td>${apt.rent}</td>
              <td>
                <button
                  className={apt.status === "Available" ? "status-available" : "status-occupied"}
                  onClick={() => handleToggleStatus(apt.id)}
                >
                  {apt.status}
                </button>
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(apt)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(apt.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApartmentManager;
