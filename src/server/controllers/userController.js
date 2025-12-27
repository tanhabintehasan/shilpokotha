import User from "../models/User.js";

/**
 * @desc    Get all users for the Admin Table
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding passwords, sorted by newest first
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    // Transform data to match your frontend table keys if necessary
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // "admin" or "customer"
      status: user.status || "Active", // Matches your UI colors
      joined: user.createdAt, // Frontend will format this date
      lastLogin: user.lastLogin,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

/**
 * @desc    Update user status (Active/Inactive/Banned)
 * @route   PUT /api/users/:id/status
 * @access  Private/Admin
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expecting "Active", "Inactive", or "Banned"
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = status;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot delete your own admin account" });
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User removed successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
