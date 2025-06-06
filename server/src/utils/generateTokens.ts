import Jwt from "jsonwebtoken";

export const generateAccessToken = (
  userId: number,
  role: string
): string => {
  const accessToken = Jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "4h" }
  );

  return accessToken;
};

export const generateRefreshToken = (
  userId: number,
  role: string
): string => {
  const refreshToken = Jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  return refreshToken;
};
