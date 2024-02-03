module.exports = func => {
    return (req, res, next) => {
        // return a function that will be executed in the route
       func(req, res, next).catch(next);
    }
}