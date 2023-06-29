import { NextFunction, Request, RequestHandler, Response } from 'express';

const parsePaging = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, filters, order } = req.query;

  try {
    const paging = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 30,
      filters: filters ? JSON.parse(filters as string) : {},
      order,
    };

    if (paging.page <= 0) paging.page = 1;
    if (paging.limit <= 0) paging.limit = 30;

    req.paging = paging;

    next();
  } catch (err) {
    res.responseAppError({
      code: 'error',
      show: 'Can not parse JSON for filters.',
      error: 'Can not parse JSON for filters.',
    });
  }
};

export default parsePaging as RequestHandler;
