import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res) => {
	try {
		const { email, name, surname, password } = req.body;

		// basic validation
		if (!email || !name || !surname || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!email.includes("@")) {
			return res.status(400).json({ message: "Email is not valid" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password is too short" });
		}

		// check exist
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(409).json({ message: "Email exists already" });
		}

		// hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email,
			name,
			surname,
			password: hashedPassword,
		});

		return res.status(201).json({
			message: "User created",
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (err) {
		return res.status(500).json({ message: "Server error" });
	}
};
