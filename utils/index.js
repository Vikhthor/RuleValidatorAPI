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
        .exists().withMessage('rule is required.'),
        body('data')
        .exists().withMessage('data is required.'),
        body('rule.field')
        .exists().withMessage('rule.field is required.')
        .isString().withMessage('rule.field should be a string.'),
        body('rule.condition')
        .exists().withMessage('rule.condition is required.')
        .custom( value => {
          const conditions = ['gte', 'gt', 'eq', 'neq', 'contains'];
          const validCondition = conditions.some(con => value === con);
          if(!validCondition){
            throw new Error("condition should either be 'eq', 'neq', 'gt', 'gte' or 'contains'.");
          } else{
            return true;
          }
        }),
        body('rule.condition_value')
        .exists().withMessage('rule.condition_value is required.'),
        body('rule').custom( value => {
          if(typeof value !== 'object'){
            throw new Error('rule should be an object.');
          }
          const nests = value.field.split('.');
          if(nests.length > 3){
              throw new Error('Nesting should not be more than two levels.');
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