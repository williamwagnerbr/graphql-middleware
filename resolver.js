
module.exports = function Resolver (middleware) {
  return async function (node, args, context) {
    /*
    var graphContext = Object.assign({}, context);
    graphContext.originalContext = context;
    */

    var response = await middleware.handlePromise(context);
    return response;

    /*
    graph.handlePromise(graphContext)
      .then((data) => {
        console.log('Finished with',data);
      })
      .catch((err) => {
        console.log('Handling error', err)
      });
    */
  }
}