import { RequestHandler } from 'express';

declare global {
  interface Object {
    trimStringProperties(): void;
  }
}
Object.prototype.trimStringProperties = function trimStringProperties(this: {
  [key: string]: string;
}) {
  if (typeof this !== 'object') return;

  for (const key in this) {
    if (typeof this[key] === 'string') this[key] = this[key].trim();
    else if (typeof this[key] === 'object') this[key].trimStringProperties();
  }
};

const trim: RequestHandler = (req, res, next) => {
  if (req.body) (req.body as object).trimStringProperties();
  if (req.params) req.params.trimStringProperties();
  if (req.query) req.query.trimStringProperties();
  next();
};

export default trim;
