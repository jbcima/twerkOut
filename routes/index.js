
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.twerk = function(req, res){
  res.render('twerk');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};