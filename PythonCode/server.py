from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import joblib
import gdown

# https://drive.google.com/file/d/1SqUpBjEGVlusHNkjXRkYL77yf3Fk7oTI/view?usp=drive_link knn
# https://drive.google.com/file/d/1cJFRKCa7G6kJvrF5c3NT4E3BXlJ9m4Ih/view?usp=drive_link vector

app = Flask(__name__)
CORS(app)

# Important: Get port from environment variable for Render
import os
port = int(os.environ.get("PORT", 5000))

file_ids = {
    'knn_model' : '1SqUpBjEGVlusHNkjXRkYL77yf3Fk7oTI',
    'vectors' : '1cJFRKCa7G6kJvrF5c3NT4E3BXlJ9m4Ih'
}

# Download files if not present
def download_file(file_id, file_name):
    if not os.path.exists(file_name):
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, file_name, quiet=False)

download_file(file_ids["knn_model"], "knn_model.pkl")
download_file(file_ids["vectors"], "vectors.npy")

# with open('clothes_index.pkl', 'rb') as f:
#     clothes = pickle.load(f)

with open('final_dataset.pkl', 'rb') as f:
    dataset = pickle.load(f)    

with open('categories.pkl', 'rb') as f:
    catset = pickle.load(f)    

with open('main_category.pkl', 'rb') as f:
    main_cat = pickle.load(f)  

with open('individual_category.pkl', 'rb') as f:
    individual_cat = pickle.load(f)     

# with open('knn_model.pkl', 'rb') as f:
#     knn_model = joblib.load(f)  

# with open('vectors.npy', 'rb') as f:
#     vectors = np.load(f)

# Convert clothes data into a DataFrame
# clothes_df = pd.DataFrame(clothes)

dataset_df = pd.DataFrame(dataset)

cat_df = pd.DataFrame(catset)

main_cat_df = pd.DataFrame(main_cat)


@app.route('/recommend/<id>', methods=['GET'])
def recommend(id):
    try:
        with open('knn_model.pkl', 'rb') as f:
            knn_model = joblib.load(f)  

        with open('vectors.npy', 'rb') as f:
            vectors = np.load(f)

        # Print incoming ID and its type
        print(f"Received product ID: {id} (type: {type(id)})")
        
        index_list = dataset_df.index[dataset_df["Product_id"].astype(str) == id].tolist()

        if not index_list:
            print(f"No product found with ID: {id}")
            return jsonify({
                'error': 'Product not found',
                'details': f'Product ID {id} does not exist in the database',
                'available_sample': dataset_df['Product_id'].astype(str).tolist()[:5]
            }), 404
        
        index = index_list[0]

        print("index - ", index)
            
        print(f"Converted product ID: {id} (type: {type(id)})")
        
        # Find products matching the ID
        matching_products = dataset_df.iloc[index]
        
        print(f"Found matching product: {matching_products['Product_id']}")
        

        # Get product details
        product_data = matching_products.fillna('').to_dict()
        print("Product data:", product_data)
        
        distances, indices = knn_model.kneighbors([vectors[index]])

        print("distance, indices = ",distances, indices[0])

        # Get the recommended product IDs
        # recommended_ids = [dataset_df.iloc[i] for i in indices[0]]

        # print("recommended_ids = ",recommended_ids)

        print('len dataset - ', len(dataset_df))
        
        recommendations = []
        for i in indices[0]:
            if i >= len(dataset_df):  
                print(f"Skipping out-of-bounds index {i} (dataset length: {len(dataset_df)})")
                continue  # Skip invalid indices

            recommended_product = dataset_df.iloc[i].fillna('').to_dict()  # Convert entire row to dictionary
            recommendations.append({
                'recommended_product': recommended_product,  # Add entire product object
                # 'score': distances[0][i]
            })
        
        print(f"Returning {len(recommendations)} recommendations")
        return jsonify({'recommendations': recommendations, "product": product_data})
    
    except ValueError as ve:
        print(f"Value Error: {str(ve)}")
        return jsonify({
            'error': 'Invalid product ID format',
            'details': str(ve)
        }), 400
    except Exception as e:
        print(f"Error in recommendation: {str(e)}")
        return jsonify({
            'error': 'Server error',
            'details': str(e)
        }), 500


@app.route('/allProducts', methods=['GET'])
def getAllProducts():
    products = dataset_df.fillna("").to_dict(orient="records")
    return jsonify(products)

@app.route('/allCategories', methods=['GET'])
def getAllCategories():
    categories = individual_cat.fillna("").to_dict(orient="records")
    return jsonify(categories)

@app.route('/allCategories/<category>', methods=['GET'])
def get_Category_Products(category):
    filtered_products = dataset_df[dataset_df['Individual_category'].str.lower() == category.lower()]
    product = filtered_products.fillna("").to_dict(orient="records")
    return jsonify(product)

@app.route('/category/<category>', methods=['GET'])
def Products(category): 
    # Filter products where 'category' column matches the requested category
    filtered_products = dataset_df[dataset_df['Individual_category'].str.lower() == category.lower()]
    print("filtered prod ",filtered_products.head(2))
    # Convert to JSON response
    products = filtered_products.fillna("").to_dict(orient="records")
    return jsonify(products)

# Define the route
@app.route('/body-shape/measurements', methods=['POST'])
def body_shape():
    data = request.get_json()

    # Validate input
    required_fields = ['bust', 'waist', 'highHip', 'hip']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "All measurements (bust, waist, highHip, hip) are required"}), 400

    try:
        bust = float(data['bust'])
        waist = float(data['waist'])
        high_hip = float(data['highHip'])
        hip = float(data['hip'])
    except ValueError:
        return jsonify({"error": "All measurements must be numeric"}), 400

    body_shape = determine_body_shape(bust, waist, high_hip, hip)
    waistHipRatio = round(waist / hip, 2)
    return jsonify({"bodyShape": body_shape, "waistHipRatio":waistHipRatio})

# Function to determine body shape
def determine_body_shape(bust, waist, high_hip, hip):
    if (bust - hip) <= 1 and (hip - bust) < 3.6 and (bust - waist) >= 9 or (hip - waist) >= 10:
        return 'Hourglass'
    elif (hip - bust) > 2 and (hip - waist) >= 7  and (high_hip/waist) >= 1.193:
        return 'Pear'
    elif (bust - hip) >= 3.6 and (bust - waist) < 9:
        return 'Inverted Triangle'
    elif (hip - bust) < 3.6 and (bust - hip) < 3.6 and (bust - waist) < 9 and (hip - waist) < 10:
        return 'Rectangle'
    elif waist >= bust * 0.9 and waist >= hip * 0.9:  # Apple shape condition
        return 'Apple'

def classify_body_shape(answers):
    # Logic to classify body shape based on answers
    if answers["widestPart"] == "hips":
        return "Pear Shape"
    elif answers["widestPart"] == "bust":
        return "Inverted Triangle"
    elif answers["widestPart"] == "middle":
        return "Apple Shape"
    elif answers["widestPart"] == "even":
        return "Rectangle"
    
    # If broad shoulders and bust > hips
    if answers["broadShoulders"] == "yes" and answers["bustSize"] == "large":
        return "Inverted Triangle"
    
    # If waist is well-defined
    if answers["waistDefined"] == "yes" and answers["hipsDescription"] == "wider":
        return "Hourglass"

    return "Unknown Shape"

@app.route("/body-shape-quiz", methods=["POST"])
def body_shape_quiz():
    data = request.get_json()
    body_shape = classify_body_shape(data)
    return jsonify({"bodyShape": body_shape})

@app.route('/main_category', methods=['GET'])
def getMainCategory():
    main_cat = main_cat_df.to_dict(orient="records")
    return jsonify(main_cat)

@app.route('/category_product/<category>', methods=['GET'])
def getCategoryWiseProduct(category):
    print('hello world')
    # Filter main_cat_df to get the category record
    filtered_df = main_cat_df[main_cat_df["m_cat"] == category]
    
    print('filtered df ', filtered_df)

    if not filtered_df.empty:
        # Get the first matching record as a dictionary
        main_cat = filtered_df.iloc[0].to_dict()
        
        # Extract the 'cat' array and convert to lowercase
        categories = [c.lower() for c in main_cat.get("cat", [])]

        print("categories - ", categories)

        filtered_category = individual_cat[individual_cat["category"].isin(categories)]

        # Convert Individual_category to lowercase and filter dataset_df
        dataset_df["Individual_category_lower"] = dataset_df["Individual_category"].str.lower()
        filtered_products = dataset_df[dataset_df["Individual_category_lower"].isin(categories)]

        return jsonify({"filtered_products":filtered_products.drop(columns=["Individual_category_lower"]).fillna("").to_dict(orient="records"), "categories":filtered_category.fillna("").to_dict(orient="records")}) 

    return jsonify([]), 404  # Return empty array if no category matches

@app.route('/product/<product_id>', methods=['GET'])
def getProductById(product_id):
    if dataset_df['Product_id'].dtype == 'int64':
        product_id = int(product_id)
    # If Product_id in DataFrame is string
    else:
        product_id = str(product_id)
        
    print(f"Converted product ID: {product_id} (type: {type(product_id)})")
    
    # Find products matching the ID
    matching_products = dataset_df[dataset_df['Product_id'] == product_id]

    print("Matching products in product :", matching_products)
    
    # Handle empty results
    if matching_products.empty:
        return jsonify({"error": "Product not found"}), 404

    # Convert DataFrame row to JSON
    product_data = matching_products.to_dict(orient="records")[0]  

    print("product data:", product_data)

    return jsonify({"product": product_data})


@app.route('/')
def home():
    return {'name' : 'Welcome to the Cloth Recommendation System!'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)