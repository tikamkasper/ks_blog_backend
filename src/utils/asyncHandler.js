const asyncHandler = (asyncFunction) => {
  return (req, res, next) => {
    Promise.resolve(asyncFunction(req, res, next)).catch((err) => next(err));
  };
};
module.exports = { asyncHandler };

// const asyncHandler = (asyncFunction) => {
//   return (req, res, next) => {
//     Promise.resolve(asyncFunction(req, res, next)).catch(next);
//   };
// };

// module.exports = { asyncHandler };

// const asyncHandler = (asyncFunction) => async (req, res, next) => {
//   try {
//     await asyncFunction(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// };
// export { asyncHandler }
