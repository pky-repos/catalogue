const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    child_categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }],
    __v: { 
        type: Number,
        select: false
    }
});

//Populating categories recursively
let autoPopulateChildren = function(next) {
    this.populate('child_categories');
    next();
};

categorySchema
.pre('findOne', autoPopulateChildren)
.pre('find', autoPopulateChildren);

module.exports.categorySchema = categorySchema;

const Category = mongoose.model('category', categorySchema);
module.exports.Category = Category;

//If category exists in the 'category' collection or not
categoryExists = function(category, cb){
    Category.find({name: category.name}, function(err, c){
        if(c.length) {
            cb(true);
        } else {
            cb(false);
        }
    });
}

//adding child categories as a document in 'category'
addChildCategory = function(category, cb) {
    categoryExists(category, function(exists){
        if (exists){
            Category.findOne({name: category.name}, function(e, cat){
                cb(cat._id);
                return;
            });
        } else {
            let categoryObj = new Category(category);
            categoryObj.save();
            cb(categoryObj._id);
            return;
        }
    }); 
}

module.exports.addChildCategory = addChildCategory;


//adding a category and its children in 'category' collection
addCategory = function(category, cb){
    var childCategoryProcessed = 0;
    
    category.child_categories.forEach((item, index, array) => {
        addChildCategory({ "name":item, "child_categories": []}, function(child){
            category.child_categories[index] = child;
            childCategoryProcessed++;

            if(childCategoryProcessed === array.length) {
                categoryExists(category, function(exists){
                    if(exists){
                        Category.update({name: category.name}, category, cb);
                    } else {
                        Category.create(category, cb).then((err, c) => {
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

module.exports.addCategory = addCategory;


//recursively fetch categories document from 'category' collection
//This uses the Schema Middleware 
getCategories = function(cb){
    Category.find({}, cb);
}

module.exports.getCategories = getCategories;
