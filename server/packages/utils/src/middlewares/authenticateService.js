const currentServiceKeys = {
    "user-service": process.env.USER_SERVICE_KEY,
    "auth-service": process.env.AUTH_SERVICE_KEY,
    "notification-service": process.env.NOTIFICATON_SERVICE_KEY,
    "realtime-service": process.env.REALTIME_SERVICE_KEY,
};

const authenticateService = (req, res, next) => {
    const serviceName = req.headers["x-service-name"];
    const serviceKey = req.headers["x-service-key"];

    if(!serviceName || !serviceKey){
        return res
            .status(401)
            .json({
                message: "Unauthorized service: Missing x-service-name or x-service-key header"
            });
    }

    const expectedKey = currentServiceKeys[serviceName];

    if(
        !expectedKey || 
        expectedKey !== serviceKey
    ){
        console.warn(
            `[Auth] Service auth failed for ${serviceName}. 
            Expected key present: ${Boolean(expectedKey)}`
        );

        return res
            .status(401)
            .json({
                message: "Unauthorized service: Invalid or unconfigured service key"
            });
    }

    req.service = serviceName;

    next();
};


export {
    authenticateService
};