var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var sort = req.query._sort || "id"
  var order = req.query._order || "asc"
  var aux = 0
                    
  if (sort == "id" && order == "asc") {
  aux = 0
  }
  else if (sort == "id" && order == "desc") {
      aux = 1
  }
  else if (sort == "title" && order == "asc") {
      aux = 2
  }
  else if (sort == "title" && order == "desc") {
      aux = 3
  }

  axios.get("http://localhost:3000/filmes?_sort=" + sort + "&_order=" + order)
    .then(resp => {
      var filmes = resp.data 
      res.render('index', {list: filmes, date: d, aux: aux});
    })
});

router.get('/filmes/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/filmes/" + req.params.id)
    .then(resp => {
      var e = resp.data 
      res.render('filmeID', {filme: e, date: d});
    })
});

router.get('/atores', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var sort = req.query._sort || "id"
  var order = req.query._order || "asc"
  var aux = 0
                    
  if (sort == "id" && order == "asc") {
  aux = 0
  }
  else if (sort == "id" && order == "desc") {
      aux = 1
  }
  else if (sort == "name" && order == "asc") {
      aux = 2
  }
  else if (sort == "name" && order == "desc") {
      aux = 3
  }
  axios.get("http://localhost:3000/atores?_sort=" + sort + "&_order=" + order)
    .then(resp => {
      var e = resp.data 
      res.render('atores', {atores: e, date: d, aux: aux});
    })
});

router.get('/atores/nome/:nome', function(req, res, next) {
  axios.get("http://localhost:3000/atores?name=" + encodeURIComponent(req.params.nome))
    .then(resp => {
      var atores = resp.data
      if (atores.length > 0) res.redirect('/atores/' + atores[0].id)
      else next()
    })
});

router.get('/atores/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/atores/" + req.params.id)
    .then(resp => {
      var e = resp.data 
      res.render('atorID', {ator: e, date: d});
    })
});

router.get('/generos', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  var sort = req.query._sort || "id"
  var order = req.query._order || "asc"
  var aux = 0
                    
  if (sort == "id" && order == "asc") {
  aux = 0
  }
  else if (sort == "id" && order == "desc") {
      aux = 1
  }
  else if (sort == "name" && order == "asc") {
      aux = 2
  }
  else if (sort == "name" && order == "desc") {
      aux = 3
  }
  axios.get("http://localhost:3000/generos?_sort=" + sort + "&_order=" + order)
    .then(resp => {
      var e = resp.data 
      res.render('generos', {generos: e, date: d, aux: aux});
    })
});

router.get('/generos/nome/:nome', function(req, res, next) {
  axios.get("http://localhost:3000/generos?name=" + encodeURIComponent(req.params.nome))
    .then(resp => {
      var generos = resp.data
      if (generos.length > 0) res.redirect('/generos/' + generos[0].id)
      else next()
    })
});

router.get('/generos/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/generos/" + req.params.id)
    .then(resp => {
      var e = resp.data 
      res.render('generoID', {genero: e, date: d});
    })
});



module.exports = router;