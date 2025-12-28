import User from "../models/User.js";

/**
 * @desc    Get all users for the Admin Table
 * @route   GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch from DB
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    console.log(`[Database Sync] Successfully fetched ${users.length} users.`);

    // 2. Format for Frontend
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "Active",
      joined: user.createdAt,
      lastLogin: user.lastLogin,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Fetch Users Error:", error.message);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

/**
 * @desc    Update user status
 * @route   PUT /api/users/:id/status
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    // SAFER CHECK: Only check req.user if the middleware is actually active
    if (req.user && userIdToDelete === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const deleted = await User.findByIdAndDelete(userIdToDelete);

    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};