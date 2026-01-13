const User = require('../models/user');

// Update teacher
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    delete updateFields.password;

    const user = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};
