import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import { expressjwt as jwt, GetVerificationKey } from 'express-jwt';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const req = ctx.getContext().req;
    const res = ctx.getContext().res;

    //const token = req.headers.authorization?.replace('Bearer ', '');

    const domain = this.configService.get('auth0.domain');
    const audience = this.configService.get('auth0.audience');
    // create a promise jwt check
    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${domain}.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: audience,
        issuer: domain,
        algorithms: ['RS256'],
      }),
    );

    try {
      // await checkJwt(req, res);
      return true;
    } catch (err) {
      console.log('err', err.message);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
