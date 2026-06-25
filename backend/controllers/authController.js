import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { email, name, surname, password } = req.body;

    // Basic validation
    if (!email || !name || !surname || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password is too short",
      });
    }

    // Check whether the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email exists already",
      });
    }

    // Hash the password
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
    console.error("Registration error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find the user in the database
    const user = await User.findOne({ email });

    // Use a generic error to avoid revealing whether the email exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate a new session ID after successful authentication
    return req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        console.error("Session regeneration error:", regenerateError);

        return res.status(500).json({
          message: "Unable to create session",
        });
      }

      // Store only the necessary user information in the session
      req.session.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        surname: user.surname,
      };

      // Save the session before returning the response
      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save error:", saveError);

          return res.status(500).json({
            message: "Unable to save session",
          });
        }

        return res.status(200).json({
          message: "Login successful",
          user: req.session.user,
        });
      });
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    user: req.session.user,
  });
};
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Unable to log out",
      });
    }

    res.clearCookie("kinetix.sid", {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  });
};
