import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request: any = context.switchToHttp().getRequest();
    console.log(request.user.sub);
    const data = request.user.user;
    return data;
  },
);
