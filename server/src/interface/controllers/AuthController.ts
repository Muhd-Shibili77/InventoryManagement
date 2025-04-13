import { Request, Response } from 'express';
import { AuthUseCase } from "../../application/useCases/AuthUseCase";
import { StatusCode } from '../../application/constants/statusCode';

export class AuthController {
  constructor(private AuthUseCase: AuthUseCase) {}

  async loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const response = await this.AuthUseCase.login(email,password)

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
}
