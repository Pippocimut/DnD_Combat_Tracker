const MAX_ITEM_PAGE = 1;
const Token = require('../models/token');

const paginationFunction = (totalItems,page) => {
    return {
      totalTokens : totalItems,
      currentPage : page,
      hasNextPage : (MAX_ITEM_PAGE*page<totalItems),
      hasPreviousPage : page>1,
      nextPage : page+1,
      previousPage : page-1,
      lastPage : Math.ceil(totalItems/MAX_ITEM_PAGE)
    }
  }

module.exports = ((req,res,next) => {

    const page = parseInt(req.query.page) || 1;

    Token.find()
    .countDocuments()
    .then(count => {
        res.locals.totalItems = count;
      return Token.find()
      .skip((page-1) * MAX_ITEM_PAGE)
      .limit(MAX_ITEM_PAGE)
    })
    .then(tokens => {
        res.locals.tokens = tokens
        console.log(res.locals.tokens)
        res.locals.pagination = paginationFunction(res.locals.totalItems,page)
        return next()
    }).catch( err => {
        return next(err)
    })

    
    
});