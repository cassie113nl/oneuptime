import LocalCache from 'CommonServer/Infrastructure/LocalCache';
import Express, {
    ExpressRequest,
    ExpressResponse,
    ExpressRouter,
    NextFunction,
} from 'CommonServer/Utils/Express';
import Response from 'CommonServer/Utils/Response';
import Sleep from 'Common/Types/Sleep';

const router: ExpressRouter = Express.getRouter();

router.get(
    '/',
    async (
        req: ExpressRequest,
        res: ExpressResponse,
        next: NextFunction
    ): Promise<void> => {
        try {
            const responseCode: number | undefined =
                LocalCache.getNumber('TestServer', 'responseCode') || 200;
            const responseTime: number | undefined =
                LocalCache.getNumber('TestServer', 'responseTime') || 0;
            const responseBody: string | undefined =
                LocalCache.getString('TestServer', 'responseBody') || '';

            if (responseTime > 0) {
                await Sleep.sleep(responseTime);
            }

            // middleware marks the probe as alive.
            // so we dont need to do anything here.
            return Response.sendCustomResponse(
                req,
                res,
                responseCode,
                responseBody
            );
        } catch (err) {
            return next(err);
        }
    }
);

export default router;