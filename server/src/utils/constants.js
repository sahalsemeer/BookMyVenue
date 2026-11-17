const Roles = {
    OWNER:'owner',
    CUSTOMER:'customer',
    ADMIN:'admin'
};
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000 // THREED DAYS TIME CONVERSION
const CANCEL_DAY_LIMIT = THREE_DAYS;
const REFUND_PERCENTAGE = 50;



module.exports = {Roles,CANCEL_DAY_LIMIT,REFUND_PERCENTAGE};