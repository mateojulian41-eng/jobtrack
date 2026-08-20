const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

async function register(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        status: "error",
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return response.status(400).json({
        status: "error",
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return response.status(409).json({
        status: "error",
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return response.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
};
