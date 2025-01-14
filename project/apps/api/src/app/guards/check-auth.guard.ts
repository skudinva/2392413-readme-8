import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { checkAuth } from './check-auth';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request['user'] = await checkAuth(this.httpService.axiosRef, request);
    return true;
  }
}
