// routes/generic.js

export const deleteItem = async (Model, id, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getById = async (Model, id, res) => {
  try {
    const item = await Model.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
