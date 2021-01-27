const { body, validationResult, _errors } = require('express-validator');

const errorResponse = (res, message, statusCode, status = 'error', data = null) => {
    res.status(statusCode).json({
      message,
      status,
      data
    });
  };

module.exports.postValidator = function(){
    return [
        body("rule")
        .exists().withMessage('rule is required'),
        //.isJSON().withMessage('rule should be an object'),
        body('data')
        .exists().withMessage('data is required'),
        //.isJSON().withMessage('data should be an object'),
        body('rule.field')
        .isString().withMessage('rule.field should be a string'),
        body('rule').custom( value => {
            const nests = value.field.split('.');
            if(nests.length > 3){
                throw new Error('Nesting should not be more than two levels');
            } else{
                return true;
            }
        })

    ]
}

module.exports.validationResponse = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().forEach((err) => {
        extractedErrors.push({ message: `${err.msg}` });
    });
    return errorResponse(res, extractedErrors[0].message, 400);
  };