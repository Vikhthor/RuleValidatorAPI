const { response } = require('express');
var express = require('express');
const { postValidator, validationResponse } = require('../utils');
var router = express.Router();

router.get('/', function(req, res, next) {
  const data = {
    message: "My Rule Validation API",
    status: "success",
    data: {
      name: "Victor Maduforo",
      github: "@vikhthor",
      email: "victormaduforo@gmail.com",
      mobile: "08131013478",
      twitter: "@maduforovictor"
    }
  };
  res.status(200).json(data);
});

router.post('/validate-rule', postValidator(), validationResponse, function(req, res){
  const { rule, data } = req.body;
  const nests = rule.field.split('.');
  const field = rule.field;
  const value = rule.condition_value;
  

  const isValid = function(){
    if(nests.length === 1){
      if(typeof data[nests[0]] === 'undefined'){
        res.status(400).json({
          "message": `field ${nests[0]} is missing from data.`,
          "status": "error",
          "data": null
        })
      }

      switch(req.body.rule.condition){
        case 'eq':
          return data[nests[0]] === value;
        case 'neq':
          return data[nests[0]] !== value;
        case 'gt':
          return data[nests[0]]> value;
        case 'gte':
          return data[nests[0]] >= value;
        case 'contains':
          if(typeof data[nests[0]] === 'string'){
            pattern = new RegExp(value, 'i');
            return pattern.test(data[nests[0]]);
          }
          if(typeof data[nests[0]] === 'array'){
            return data[nests[0]].some(i => value === i);
          }  
      }
    }
    if(nests.length === 2){
      if(typeof data[nests[0]][nests[1]] === 'undefined'){
        res.status(400).json({
          "message": `field ${nests[0]}.${nests[1]} is missing from data.`,
          "status": "error",
          "data": null
        })
      }

      switch(req.body.rule.condition){
        case 'eq':
          return data[nests[0]][nests[1]] === value;
        case 'neq':
          return data[nests[0]][nests[1]] !== value;
        case 'gt':
          return data[nests[0]][nests[1]] > value;
        case 'gte':
          return data[nests[0]][nests[1]] >= value;
        case 'contains':
          if(typeof data[nests[0]][nests[1]] === 'string'){
            pattern = new RegExp(value, 'i');
            return pattern.test(data[nests[0]][nests[1]]);
          }
          if(typeof data[nests[0]][nests[1]] === 'array'){
            return data[nests[0]][nests[1]].some(i => value === i);
          } 
      }
    }
    if(nests.length === 3){
      if(typeof data[nests[0]][nests[1]][nests[2]] === 'undefined'){
        res.status(400).json({
          "message": `field ${nests[0]}.${nests[1]}.${nests[2]} is missing from data.`,
          "status": "error",
          "data": null
        })
      }
      switch(req.body.rule.condition){
        case 'eq':
          return data[nests[0]][nests[1]][nests[2]] === value;
        case 'neq':
          return data[nests[0]][nests[1]][nests[2]] !== value;
        case 'gt':
          return data[nests[0]][nests[1]][nests[2]] > value;
        case 'gte':
          return data[nests[0]][nests[1]][nests[2]] >= value;
        case 'contains':
          if(typeof data[nests[0]][nests[1]][nests[2]] === 'string'){
            pattern = new RegExp(value, 'i');
            return pattern.test(data[nests[0]][nests[1]][nests[2]]);
          }
          if(typeof data[nests[0]][nests[1]][nests[2]] === 'array'){
            return data[nests[0]][nests[1]][nests[2]].some(i => value === i);
          }
      }
    }
  }
  if(isValid()){
    res.status(200).json({
      "message": `field ${field} successfully validated.`,
      "status": "success",
      "data": {
        "validation": {
          "error": false,
          "field": `${field}`,
          "field_value": (nests.length === 1)? `${req.body.data[nests[0]]}` :
                        (nests.length === 2)? `${req.body.data[nests[0]][nests[1]]}` :
                        `${req.body.data[nests[0]][nests[1]][nests[2]]}`,
          "condition": `${req.body.rule.condition}`,
          "condition_value": `${value}`
        }
      }
    })
  } else{
    res.status(400).json({
      "message": `field ${field} failed validation.`,
      "status": "error",
      "data": {
        "validation": {
          "error": true,
          "field": `${field}`,
          "field_value": `${req.body.data[field]}`,
          "condition": `${req.body.rule.condition}`,
          "condition_value": `${value}`
        }
      }
    })
  };
});

module.exports = router;
