const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');

router.post('/add_category', (req, res) => {
    let category = req.body;
    Category.addCategory(req.body, function(err, category) {
        if(err) {
            throw err;
        }   
        res.json(category);
    });
});

router.get('/get_categories', (req, res) => {
    Category.getCategories((err, categories) => {
        if(err) {
            throw err;
        }   
        res.json(categories);
    })
});

router.post('/add_product', (req, res) => {
    let product = req.body;
   
    Product.addProduct(req.body, function(err, product) {
        if(err) {
            throw err;
        }   
        res.json(product);
    });
});

router.get('/get_category_products/:category', (req, res) => {
    let category = req.params.category;

    Product.getCategoryProducts(category, (err, products) => {
        if(err) {
            throw err;
        }   
        res.json(products);
    })
});

router.post('/update_product', (req, res) => {
    Product.updateProduct(req.body, (err, product) => {
        if(err) {
            throw err;
        }   
        res.json(product);
    })
});

module.exports = router;