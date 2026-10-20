const KAFKA_EVENTS = Object.freeze({

    USER: {
        CREATED: "user.created",
        UPDATED: "user.updated",

        PROFILE_UPDATED: "user.profile_updated",

        PHONE_UPDATED: "user.phone_updated",
        EMAIL_UPDATED: "user.email_updated",

        PASSWORD_CHANGED: "user.password_changed",

        ACTIVATED: "user.activated",
        DEACTIVATED: "user.deactivated",

        BLOCKED: "user.blocked",
        UNBLOCKED: "user.unblocked"
    },

    REVIEW: {
        CREATED: "review.created"
    }
});


export {
    KAFKA_EVENTS
};