import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { RegisterUserInput, LoginUserInput } from "../../types/user";
import { userExist } from "../../utils/prisma";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { signJWT, verifyJWT } from "../../utils/jwt";
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../../utils/validators/userValidators";
import { RefreshRequest, AuthenticatedRequest } from "../../types/express";


const prisma = new PrismaClient();

//registerUser
export async function registerUser(
  req: Request<{}, {}, RegisterUserInput>,
  res: Response
) {
  const registerData = req.body;

  if (!registerData || Object.keys(registerData).length === 0) {
    res.status(400).json({ message: "Not even a little info was provided." });
    return;
  }

  const [hasErrors, errors] = userRegistrationValidator(registerData);

  if (hasErrors) {
    res.status(400).json({ hasErrors, errors });
    return;
  }

  try {
    const userAlreadyExist = await userExist(registerData.email, prisma);

    if (userAlreadyExist) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }

    const hashedPassword = await hashPassword(registerData.password);

    const user = await prisma.user.create({
      data: {
        email: registerData.email.toLowerCase(),
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        password: hashedPassword,
        refreshToken: "",
      },
    });

    const accessToken = await signJWT({ userId: user.id });
    const refreshToken = await signJWT({ userId: user.id }, "7d");

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res.status(201).json({
      message: "User created",
      accessToken,
      refreshToken,
      userId: user.id,
    });
    return;
  } catch (error) {
    console.log("registerUser error: ", error);
    res.status(500);
    return;
  }
}

//loginUser
export async function loginUser(
  req: Request<{}, {}, LoginUserInput>,
  res: Response
) {
  const loginData = req.body;

  if (!loginData) {
    res.status(400).json({ message: "No login data provided" });
    return;
  }

  const [hasErrors, errors] = userLoginValidator(loginData);

  if (hasErrors) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: loginData.email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const correctPassword = await comparePassword(
      loginData.password,
      user.password
    );
    if (!correctPassword) {
      res.status(400).json({ message: "Unvalid credentials" });
      return;
    }

    const accessToken = await signJWT({ userId: user.id });
    const refreshToken = await signJWT({ userId: user.id }, "7d");

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
      userId: user.id,
    });
  } catch (error) {
    console.log("loginUser error: ", error);
    res.status(500);
    return;
  }
}

//refreshToken
export async function refreshToken(req: RefreshRequest, res: Response) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  try {
    const decoded = await verifyJWT(refreshToken);

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Refresh token mismatch" });
      return;
    }

    const newRefreshToken = await signJWT({ userId: user.id }, "7d");
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    const newAccessToken = await signJWT({ userId: user.id });

    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
      refreshToken,
      userId: user.id,
    });
    return;
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
}

//deleteMyProfile
export async function deleteMyProfile(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res
      .status(204)
      .json({ message: "User deleted and refresh token cleared." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

//getMyProfile
export async function getMyProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.userId;
  console.log("getMyProfile, userId: ", userId);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
    return;
  } catch (error) {
    console.log("getMyProfile error", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

