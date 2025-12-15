async function getExamples(req, res, next) {
  try {
    res.json([{ id: 1, name: 'Sample Item' }]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getExamples };
