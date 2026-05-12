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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validazione base
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Cerca l'utente nel database
    const user = await User.findOne({ email });

    // Se l'utente non esiste
    if (!user) {
      // È buona pratica usare un messaggio generico per sicurezza (evita l'enumerazione delle email)
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Confronta la password inserita con l'hash salvato nel DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successo!
    // Nota: Qui solitamente si genera e restituisce un token JWT (JSON Web Token)
    // per mantenere la sessione attiva nel frontend. Per ora restituiamo i dati utente.
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname, // Se hai salvato anche il cognome
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
