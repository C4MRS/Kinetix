import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res) => {
	try {
		const { email, name, surname, password } = req.body;

		// validazione base
		if (!email || !name || !surname || !password) {
			return res
				.status(400)
				.json({ message: "Tutti i campi sono obbligatori" });
		}

		if (!email.includes("@")) {
			return res.status(400).json({ message: "Email non valida" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password troppo corta" });
		}

		// check esistenza
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ message: "Email già registrata" });
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
			message: "Utente creato",
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (err) {
		return res.status(500).json({ message: "Errore server" });
	}
};
