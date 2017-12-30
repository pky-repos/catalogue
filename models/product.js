const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./category');

const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    categories:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }],
    __v: { 
        type: Number,
        select: false
    }
});

const Product = mongoose.model('product', productSchema);
module.exports.Product = Product;

productExists = function(product, cb){
    Product.find({name: product.name}, function(err, c){
        if(c.length) {
            cb(true);
        } else {
            cb(false);
        }
    });
}


addChildProduct = function(product, cb) {

    productExists(product, function(exists){
        if (exists){
            Product.findOne({name: product.name}, function(e, cat){
                cb(cat);
                return;
            });
        } else {
            let productObj = new Product(product);
            productObj.save();
            cb(productObj);
            return;
        }
    }); 
}


addProduct = function(product, cb){
    
    let associatedCategoryProcessed = 0;

    product.categories.forEach((item, index, array) => {
        Category.addChildCategory({ "name": item, "child_categories": []}, function(child){
            product.categories[index] = child;
            associatedCategoryProcessed++;

            if(associatedCategoryProcessed === array.length) {
                productExists(product, function(exists){
                    if(exists){
                        Product.update({name: product.name}, product, cb);
                    } else {
                        Product.create(product, cb).then((err, c) => {
                            if(err){
                                return err;
                            }
                            return c;
                        });
                    }
                });
            }
        });   
    });
} 

module.exports.addProduct = addProduct;


getCategoryProducts = function(category, cb){
    console.log(category);
    
    Category.addChildCategory({ "name": category, "child_categories": []}, function(child){
        Product.find({categories: mongoose.Types.ObjectId(child)},{ "categories": 0 }, cb).then(function(err, products){
            if(err){
                return err;
            }
            return products;
        });
    });   
}

module.exports.getCategoryProducts = getCategoryProducts;


updateProduct = function(product, cb){

    let associatedCategoryProcessed = 0;

    product.categories.forEach((item, index, array) => {
        Category.addChildCategory({ "name": item, "child_categories": []}, function(child){
            product.categories[index] = child;
            associatedCategoryProcessed++;

            if(associatedCategoryProcessed === array.length) {
                Product.update({name: product.name}, product, function(err, updatedProduct){
                    cb(err, updatedProduct);
                });
            }
        });   
    });
}

module.exports.updateProduct = updateProduct;