import jwt from "jsonwebtoken";

export const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
