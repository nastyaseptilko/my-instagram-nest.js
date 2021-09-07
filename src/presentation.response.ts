import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from 'src/auth/interfaces/auth.middleware.interfaces';

type Params = {
    req: AuthenticatedRequest | Request;
    res: Response;
    data?: any;
    render?: {
        viewName: string;
        options: any;
    };
};

export function toPresentation(params: Params) {
    const contentType = params.req.headers['content-type'];

    switch (contentType) {
        case 'application/json': {
            if (!params.data) {
                throw new UnsupportedMediaTypeException();
            }
            params.res.json(params.data);
            break;
        }
        case 'text/html': {
            if (!params.render) {
                throw new UnsupportedMediaTypeException();
            }
            params.res.render(params.render.viewName as string, params.render.options);
            break;
        }
        default: {
            const acceptContentType = params.req.headers['accept']?.split(',')[0];

            if (acceptContentType && acceptContentType === 'text/html') {
                params.res.render(params.render?.viewName as string, params.render?.options);
            } else {
                throw new UnsupportedMediaTypeException();
            }
        }
    }
}
