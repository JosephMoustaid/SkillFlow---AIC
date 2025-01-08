const User = require("../models/User");

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password , preference } = req.body;
        const user = new User(firstName, lastName, email, password , preference);
        await user.signUp();
        res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.signIn(email, password);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user);
        res.status(200).json({ message: "User signed in successfully", user  });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
