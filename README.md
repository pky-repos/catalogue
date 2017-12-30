# catalogue
Category and Products API

For host = localhost

1. Add a category :

    Method : POST 
    Request URL : http://localhost:3000/api/add_category
    Body : 
        Example 1 :
            {
                "name": "book",
                "child_categories": [
                    "fiction",
                    "textbook",
                    "exam"
                ]
            }

        Example 2 :
            {
                "name": "fiction",
                "child_categories": [
                    "contemporary",
                    "classic",
                    "religious"
                ]
            }


2. Add Product mapped to a category or categories :

    Method : POST 
    Request URL : http://localhost:3000/api/add_product
    Body : 

        Example 1 :
            {
                "name": "The Alchemist",
                "price": 182,
                "author":  "Paulo Coelho",
                "categories": [
                    "book",
                    "fiction",
                    "contemporary"
                ]
            }

        Example 2 : 
            {
                "name": "The Holy Science",
                "price": 75,
                "author": "Swami Sri Yukteswar Giri",
                "categories": [
                    "book",
                    "fiction",
                    "religious"
                ]
            }

3. Get all categories with all its child categories mapped to it :

    Method : GET 
    Request URL : http://localhost:3000/api/get_categories

4. Get all products by a category : 
    Method : GET 
    Request URL : http://localhost:3000/api/get_category_products/fiction

5. Update product details :

    Method : POST 
    Request URL : http://localhost:3000/api/update_product
    Body : 
    
        Example 1 :
            {
                "name": "The Alchemist",
                "price": 200,
                "categories": [
                    "book",
                    "fiction",
                    "contemporary",
                ]
            }
