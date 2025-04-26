import { Request, Response } from 'express';
import { AuthUseCase } from "../../application/useCases/AuthUseCase";
import { StatusCode } from '../../application/constants/statusCode';

export class AuthController {
  constructor(private AuthUseCase: AuthUseCase) {}

  async loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const response = await this.AuthUseCase.login(email,password)

        res.cookie('refreshToken', response.refreshToken, {
          httpOnly: true,
          secure: true, // must be true for sameSite: 'none'
          sameSite: 'none', // needed for cross-origin
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        

        return res.status(StatusCode.OK).json({
            success: true,
            message: "Login successful",
            response,
            Token: response.Token,
          });

    } catch (error: any) {
      console.error(error);
      res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
    }
  }
  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(403)
          .json({ success: false, message: "Refresh token missing" });
      }

      const newAccessToken = await this.AuthUseCase.newAccessToken(
        refreshToken
      );
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
  }
}
