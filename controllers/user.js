const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.userRegistration = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ status: false, msg: "email and password are required" })
        }
        const user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(400).json({ status: false, msg: "user already exist" });
        }
        let hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await userModel.create({ email: email, password: hashedPassword });
        const token_payload = {
            email: email,
            id: newUser._id
        }
        let token = jwt.sign(token_payload, process.env.JWT_SECRET);

        newUser.tokens = [
            ...newUser.tokens,
            token
        ]

        await newUser.save()

        return res.status(200).json({ status: true, token: token });

    } catch (error) {
        console.log(": error :", error);
        return res.status(500).json({ status: false, msg: "something went wrong" })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, msg: "email and password are required" })
        }
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ status: false, msg: "user not exist" });
        }
        let isPasswordMatch = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatch) {
            return res.status(403).json({ status: false, msg: "incorrect password" })
        }
        const payload = {
            id: user._id,
            email: user.email
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET);
        user.tokens = [
            ...user.tokens,
            token
        ]
        await user.save();
        return res.status(200).json({ status: true, token: token })
    } catch (error) {
        console.log("error >_", error);
        return res.status(500).json({ status: false, msg: "something went wrong" })
    }
}

exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            let User = await userModel.updateOne({ _id: user.id }, { $pull: { tokens: { $in: [token] } } });
            console.log("User >_", User);
            if (User.acknowledged && User.modifiedCount && User.matchedCount) {
                return res.status(200).json({ status: true, msg: "logout success" });
            }
            if (!User.modifiedCount || !User.matchedCount) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            return res.status(400).json({ status: false, msg: "logout not succeed" });
        });
    } catch (error) {
        console.log("error >_", error);
        return res.status(500).json({ status: false, msg: "something went wrong" })
    }
}