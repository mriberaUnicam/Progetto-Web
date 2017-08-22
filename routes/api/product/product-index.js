// =======================
// API ROUTES 
// =======================
var express = require('express');
var bodyParser = require('body-parser');
var product_utilities = require('./product-utilities');
var adminRoutes = express.Router(); 
var productRoutes = express.Router();
module.exports = productRoutes;

productRoutes.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
productRoutes.use(bodyParser.json());
// parse application/vnd.api+json as json
productRoutes.use(bodyParser.json({ type: 'application/vnd.api+json' }));

productRoutes.get('/all', function(req, res){
  product_utilities.getAllProducts()
    .then(function(products)
      {
        res.status(201).json({ success: true , 
        msg:"lista di tutti i prodotti", 
        data:products});
      })
      .catch(function(err)
      {
        res.status(400).json({ success: false , 
        msg:err, 
        data:""}); 
      });
});

productRoutes.post('/add', function(req,res){
  console.log("Body: ");
  console.log(req.body);

  var code = req.body.code;
  var name = req.body.name;
  var desc  = req.body.desc;
  var price = req.body.price;
  var url = req.body.url.split(",");
  var weight = req.body.weight;
  var categories = req.body.cat.split(",");
  var quantity =  req.body.quantity;

  // controllo parametri
  if (!name || !desc || !categories)
      {
        console.log("Body error");
        return res.status(400).json({ success: false, 
                                      code:product_utilities.ERR_MISSING_DATA,
                                      message: 'Bad Request name desc or categories missing' });  
      } 
   // esecuzione funzione    
  console.log("Dati (api_index): "+desc+" "+name+" "+price+" "+categories);
  product_utilities.addProduct(name, desc, price, categories, code, url, weight, quantity)
        .then(function(product)
          {
           Console.log("In teoria è salvato");
           res.status(201).json({ success: true , msg:"prodotto salvato", data:product});
          })
        .catch(function(err)
          {
             res.status(400).json({ success: false , 
                                    code:err.code,
                                    msg:err.msg, 
                                    data:""}); 
          });
})

productRoutes.post('/orders', function(req, res)
          {
            console.log("Sono l'handler degli ordini");
            console.log(req.body.data);
            var data = JSON.parse(req.body.data);
            console.log(data);
          });

productRoutes.post('/search', function(req, res){
    product_utilities.searchProduct(req.body.q)
      .then(function(product){
        res.status(201).json({ success: true , 
        msg:"prodotti trovati", 
        data:product});
    });
});

