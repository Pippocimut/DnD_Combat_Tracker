const Token = require('../models/token');
const {validationResult} = require('express-validator')
const fileHelper = require('../util/file')

const errorGet = (status_code,err)=>{
  console.log("Error from ErrorGet function")
  const error = new Error(err);
  error.httpStatusCode = status_code;
  return error;
};

exports.getTokens = (req, res, next) => {
  console.log(req.user._id)
  Token.find({userId : req.user._id})
    .then(tokens => {
      console.log(req.user._id)
      console.log(tokens);
      res.render('admin/tokens', {
        prods: tokens,
        pageTitle: 'Admin Tokens',
        path: '/admin/tokens',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => next(errorGet(500,err)));
};

exports.saveToken = (req, res, next) => {
  const tokenId = req.params.tokenId;
  console.log("Saving the tokens")
  Token.findById(tokenId)
  .then(token => {
    console.log("Search done")
    if(!token){
      console.log("Token not found")
      const newToken = {
        position : {
          y: +req.get('y'),
          x: +req.get('x')
        }
      }

      const token = new Token({
        ...newToken
      });

      return token
        .save()
        .then(result => {
          // console.log(result);
          console.log('Created Token');
          return res.redirect('/admin/tokens');
        })
        .catch(err => {
          console.log("Error", err)
          return next(errorGet(500,err))
        });
    }

    return Token.findById(tokenId)
    .then(token => {

      token.position = {
        y: +req.get('y'),
        x: +req.get('x')
      };

      return token.save();
    }).then(result => {
      console.log(result)
    })
    .catch(err => {
      return next(errorGet(500,err))
    })
  }).then(() => {
      console.log('UPDATED PRODUCT');
      res.status(200).json({
        message: 'Success!'
      });
    })
    .catch(err =>{
      console.log("Error"+err)
      res.status(500).json({
        message: 'Deleting token failed.'+err
      });
    });
};

