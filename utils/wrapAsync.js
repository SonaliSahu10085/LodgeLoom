function wrapAsync(cb) {
  return function (req, res, next) {
    cb(req, res, next).catch(next);
  };
}

module.exports = wrapAsync;