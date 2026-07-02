import User from "../models/user.js";

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.session?.user?.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(req.session.user.id).select("role");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      message: "Unable to verify admin permissions",
    });
  }
};
