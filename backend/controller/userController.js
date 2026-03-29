const user = require("../module/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAdmin = require("../middleware/adminMiddleware");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashedpassword,
            role:"user",
            isActive:true
        });

        const token = jwt.sign(
            {id:newUser._id},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );

        res.status(201).json({
            message: "user registered",
            token,
            user:{ 
            id : newUser._id,
            name: newUser.name,
            email : newUser.email,
            role :newUser.role
        }
            
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN  
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await user.findOne({ email });

        // user nahi mila
        if (!existingUser) {
            return res.status(400).json({ message: "user not found" });
        }

        // password galat
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        // token generate
        const token = jwt.sign(
            
            { id: existingUser._id,
            role:existingUser.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successfully",
            token,
            user:{
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                isActive :existingUser.isActive
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET
const getUser = async (req, res) => {
    try {
        const users = await user.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        let updateData = { name, email };

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            updateData.password = hashed;
        }

        const updatedUser = await user.findByIdAndUpdate(id, updateData, {
            new: true}.select("-password")
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if(req.user.id == id){
            return res.status(403).json({message:"not allowed"})
        }

        await user.findByIdAndDelete(id);

        res.json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
};