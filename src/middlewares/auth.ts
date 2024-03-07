import { RequestHandler } from 'express';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { authJwtSecret } from '../config/environment';
import { ClientError } from './error';

export const JwtUser = z.object({
  name: z.string().min(1).max(32),
  role: z.string().min(1).max(32),
});
export type JwtUser = z.infer<typeof JwtUser>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends JwtUser {}
  }
}

interface JwtPayload {
  iat: number;
  sub: string;
  user: JwtUser;
}

passport.use(
  new Strategy(
    {
      secretOrKey: authJwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField('token'),
      ]),
    },
    (jwtPayload: JwtPayload, done) => done(null, jwtPayload.user),
  ),
);

export default function userAuth(
  allowedRoles: undefined | string | string[] = undefined,
): RequestHandler {
  return function (req, res, next) {
    (
      passport as passport.Authenticator<RequestHandler, RequestHandler>
    ).authenticate(
      'jwt',
      { session: false },
      (err: Error | null, user: unknown) => {
        if (err) return next(err);
        if (!user) return next(new ClientError('👽 - Unauthorized', 401));
        req.user = JwtUser.parse(user);

        if (!allowedRoles) return next();
        if (typeof allowedRoles === 'string' && req.user.role === allowedRoles)
          return next();
        if (Array.isArray(allowedRoles) && allowedRoles.includes(req.user.role))
          return next();

        return next(new ClientError('🚫 - Forbidden', 403));
      },
    )(req, res, next);
  };
}
