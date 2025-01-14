import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkAuth } from './check-auth';

@Injectable()
export class CheckAuthForceGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      request['user'] = await checkAuth(this.httpService.axiosRef, request);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      request['user'] = null;
    }

    return true;
  }
}
