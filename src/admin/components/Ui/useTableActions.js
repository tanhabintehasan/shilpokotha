import { useState } from "react";
import axios from "axios";

export const useTableActions = (baseUrl, refreshData) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete this?`)) {
      try {
        await axios.delete(`${baseUrl}/${item._id}`);
        alert("Deleted successfully");
        refreshData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingItem,
    handleDelete,
    handleEdit,
    closeModal,
  };
};
