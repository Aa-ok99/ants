module.exports = (req, res) => {
  res.json({
    name: "Ants API",
    status: "working",
    time: new Date().toISOString()
  });
};
