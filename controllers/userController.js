const User = require("../models/user");



const getAllUsers = async (req, res) => {
    const user = await User.find()
    res.status(200).json({ user });
};

const getSingleUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message:"you are not authorized to perform this operation"})
    };
    
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user })
};

const updateUser =async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ user });
}

const deleteUser = async(req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "user deleted successfully" });
}

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};