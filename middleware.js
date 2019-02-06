
module.exports = function Middleware () {

  /**
   * Middleware stack
   * @var {array} stack
   */
  var stack = [];

  /**
   * Add a middleware to stack
   * @param {function} middleware
   */
  this.use = function (middleware) {
    stack.push(middleware);
    return this;
  }

  /**
   * Handle middlewares
   * @param {object} context
   * @param {function} callback
   */
  this.handle = async function (context, callback) {
    context.finished = false;

    var response = function (err, data) {
      if (context.finished) {        
        throw new TypeError('Response already returned');
      }

      context.finished = true;
      callback(err, data);
    }

    async function resolveMiddleware (middleware, index) {
      try {
        var nindex = index + 1;
        var next = stack[nindex];

        return await middleware(context, response, async function () {
          if (!next) {
            next = function () {
              console.log('Point of no return');
              throw new TypeError('Point of no return');
            };
          }
          return await resolveMiddleware(next, nindex);
        });
      } catch (e) {
        response(e);
      }
    }

    //return resolveMiddleware(stack[0], 0);
    return await resolveMiddleware(stack[0], 0);
  }

  /**
   * Handle middleware (Promise like)
   * @param {object} context
   * @returns {Promise}
   */
  this.handlePromise = function (context) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.handle(context, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }
}