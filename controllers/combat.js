const Token = require('../models/token');
const Order = require('../models/order');
const fs = require("fs");
const path = require('path');
const PDFDocument =  require('pdfkit');
const stripe = require('stripe')('sk_test_51OcPrdELAWo6mDK5AEObHxeowolmbMUbJRXDKsJCMArPtH5UOWWFQMpS6LezR5fh0So702dDUKu5ZzsXbxo8wk7m00mL8YtjHQ');

const errorGet = (status_code,err)=>{
  console.log("Error from ErrorGet function")
  console.log(err)
  const error = new Error(err);
  error.httpStatusCode = status_code;
  return error;
};

exports.getTokens = (req, res, next) => {
  res.render('combat/token-list', {
    prods: res.locals.tokens,
    pageTitle: 'All Tokens',
    path: '/tokens',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.getToken = (req, res, next) => {
  const prodId = req.params.tokenId;
  Token.findById(prodId)
    .then(token => {
      res.render('combat/token-detail', {
        token: token,
        pageTitle: token.title,
        path: '/tokens',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Token.find().then(tokens => {
    res.render('combat/index', {
      tokens : tokens,
      pageTitle : 'combat',
      path : '/',
      cellSize : 70,
    });
  })
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.tokenId')
    .execPopulate()
    .then(user => {
      const tokens = user.cart.items;
      res.render('combat/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        tokens: tokens,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteToken = (req, res, next) => {
  const prodId = req.body.tokenId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('combat/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getAddToken = (req,res,next) => {

  res.render('combat/add-token', {
    path: '/add-token',
    pageTitle: 'Add Token',
    isAuthenticated: req.session.isLoggedIn
  });
}
exports.postAddToken = (req,res,next) => {

  var image = req.file
  var name =  req.body.name

  if(!image){
    console.log("No image found")
  }

  const token = new Token({
    imageUrl: image.path,
    title: name,
    position: {
      x: 0,
      y: 0
    }
  })

  token.save().then(result =>{
    res.redirect("/");
  }).catch(err => {
    console.log(err)
    res.redirect("/add-token")
  })
  
}