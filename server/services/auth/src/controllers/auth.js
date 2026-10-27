import { 
    asyncHandler,
    ApiResponse
} from '@lokresolve/utils';

import{
    loginService,
    getMyProfileService
} from '../services/auth.js';


const loginUser = asyncHandler(async (req, res) => {

    const {
        user,
        token
    } = await loginService({
        body: req?.body 
    });


    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    user,
                    token
                },
                "User logged in successfully"
            )
        );
});

const getMyProfile = asyncHandler(async (req, res) => {

    const user = await getMyProfileService({
        userId: req?.user?.id
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            { user },
            "Profile fetched successfully"
        )
    );
});


export {
    loginUser,
    getMyProfile
};