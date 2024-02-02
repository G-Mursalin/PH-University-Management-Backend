import { Response } from 'express';
type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
};

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: TMeta | undefined;
    data: T | T[] | null;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    return res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};

export default sendResponse;
