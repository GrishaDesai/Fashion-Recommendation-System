from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import joblib
import gdown
import ast
from difflib import SequenceMatcher
import cv2
from skintone_model import load_model, predict_skin_tone


# https://drive.google.com/file/d/1SqUpBjEGVlusHNkjXRkYL77yf3Fk7oTI/view?usp=drive_link knn
# https://drive.google.com/file/d/1cJFRKCa7G6kJvrF5c3NT4E3BXlJ9m4Ih/view?usp=drive_link vector

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "https://tiyara-1.onrender.com"}})
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True) 
# Allow specific origins
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://tiyara-1.onrender.com"]}})


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

# def download_file(file_id, file_name):
#     if not os.path.exists(file_name):
#         url = f"https://drive.google.com/uc?id={file_id}"
#         gdown.download(url, file_name, quiet=False)
#         if not os.path.exists(file_name) or os.path.getsize(file_name) == 0:
#             raise Exception(f"Failed to download {file_name}")

download_file(file_ids["knn_model"], "knn_model.pkl")
download_file(file_ids["vectors"], "vectors.npy")

skintone_model = load_model("skin_tone_model_dict.pt")

with open('final_dataset_tags.pkl', 'rb') as f:
    dataset = pickle.load(f)    

with open('categories.pkl', 'rb') as f:
    catset = pickle.load(f)    

with open('main_category.pkl', 'rb') as f:
    main_cat = pickle.load(f)  

with open('individual_category.pkl', 'rb') as f:
    individual_cat = pickle.load(f)  

with open('bodyshape.pkl', 'rb') as f:
    bodyshape = pickle.load(f)   

with open('clothes_index.pkl', 'rb') as f:
    clothes_tags_df = pickle.load(f)

with open('occasions.pkl', 'rb') as f:
    occasions = pickle.load(f)    

# with open('knn_model.pkl', 'rb') as f:
#     knn_model = joblib.load(f)  

# with open('vectors.npy', 'rb') as f:
#     vectors = np.load(f)

# Convert clothes data into a DataFrame
# clothes_df = pd.DataFrame(clothes)

dataset_df = pd.DataFrame(dataset)

cat_df = pd.DataFrame(catset)

main_cat_df = pd.DataFrame(main_cat)

body_shape_df = pd.DataFrame(bodyshape)


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

@app.route('/recommend/body_shape/<shape>', methods=['GET'])
def body_shape_recommendations(shape):
    shape_data = body_shape_df[body_shape_df["Name"] == shape].fillna("").to_dict(orient="records")

    final_tag = ast.literal_eval(shape_data[0]["Keywords"])

    print(f"Final tag: {final_tag}")

    # Now match products from products_df based on final_tag
    recommended_products = recommend_products_body_shape(final_tag)

    # Convert DataFrame to a JSON-serializable format
    recommended_products_json = recommended_products.fillna('').to_dict(orient="records")
    
    return jsonify({
        'final_tag': final_tag,
        'recommended_products': recommended_products_json
    })


# def recommend_products_body_shape(tags):
#     # Convert input tags string into a set of keywords
#     search_keywords = set(tags.lower().split())  

#     def contains_search(tag_string):
#         if pd.isna(tag_string):  # Handle NaN values
#             return False
#         tag_set = set(tag_string.lower().split())  # Convert tags column to a set of words
#         return any(keyword in tag_set for keyword in search_keywords)  # Check for matches
    
#     # Filter dataset where 'tags' column contains any keyword from the search string
#     df_filtered = dataset_df[dataset_df['tags'].apply(contains_search)]
    
#     return df_filtered.head(5)  # Return top 5 matches

# def recommend_products_body_shape(keywords):
#     print('keywords ', keywords)

#     # Function to check if any keyword fully matches in tags
#     def has_keyword_match(tags):
#         if not isinstance(tags, str):
#             return False
#         tag_words = set(tags.lower().split())
#         for keyword in keywords:
#             keyword_words = set(keyword.lower().split())
#             # Check if all words in keyword are present in tags
#             if keyword_words.issubset(tag_words):
#                 return True
#         return False
    
#     # Apply the matching function and filter main_df
#     matched_df = dataset_df[dataset_df['tags'].apply(has_keyword_match)]
#     return matched_df

def recommend_products_body_shape(keywords):
    # keyword_words = list(keyword_words)
    print('keywords here ', keywords)
    print('keywords length ', len(keywords))

    matching_products = []
    used_ids = set()  # Track product IDs to avoid duplicates

    for index, product in dataset_df.iterrows():
        product_tags = str(product['tags']).lower()
        product_id = product['Product_id']  # Replace with your unique column name
        
        for keyword_phrase in keywords:
            keyword_words = keyword_phrase.split(' ')
            # print('keywords ',keyword_phrase)
            f = 0
            
            for word in keyword_words:
                if word not in product_tags:
                    f = 1
                    break

            # If all words match and ID not used, append product
            if f == 0 and product_id not in used_ids:
                matching_products.append(product)
                used_ids.add(product_id)
                break  # Exit keyword loop once matched
    
    print("len ", len(matching_products))
    
    if matching_products:
        return pd.DataFrame(matching_products)
    else:
        return dataset_df.head(0).drop(columns=['tags_lower'], errors='ignore')   

# def recommend_products_body_shape(keywords):
#     print('keywords:', keywords)

#     # Define a function to check if all words in a keyword phrase are in product tags
#     def match_keywords(tags):
#         tags = str(tags).lower()  # Ensure it's a string

#         for keyword_phrase in keywords:
#             keyword_words = keyword_phrase.split()  # Split keyword phrase into words
#             f = 0
            
#             for word in keyword_words:
#                 if word not in tags:
#                     f = 1
#                     break

#             if f == 0:
#                 return True  # Match found

#         return False  # No match found

#     # Apply function to filter dataset
#     matching_products = dataset_df[dataset_df['tags'].apply(match_keywords)]

#     print("len:", len(matching_products))

#     return matching_products if not matching_products.empty else dataset_df.head(0).drop(columns=['tags_lower'])


# @app.route('/recommend/<id>', methods=['GET'])
# def recommend(id):
#     try:
#         index_list = dataset_df.index[dataset_df["Product_id"].astype(str) == id].tolist()
#         if not index_list:
#             return jsonify({
#                 'error': 'Product not found',
#                 'details': f'Product ID {id} does not exist',
#                 'sample_ids': dataset_df['Product_id'].astype(str).tolist()[:5]
#             }), 404
#         index = index_list[0]
#         distances, indices = knn_model.kneighbors([vectors[index]])
#         recommendations = []
#         for i in indices[0]:
#             if i >= len(dataset_df):
#                 continue
#             recommended_product = dataset_df.iloc[i].fillna('').to_dict()
#             recommendations.append({'recommended_product': recommended_product})
#         product_data = dataset_df.iloc[index].fillna('').to_dict()
#         return jsonify({'recommendations': recommendations, 'product': product_data})
#     except Exception as e:
#         return jsonify({'error': 'Recommendation failed', 'details': str(e)}), 500

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
    required_fields = ['bust', 'waist', 'highHip', 'hip', 'shoulder']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "All measurements (bust, waist, highHip, hip, shoulder) are required"}), 400

    try:
        bust = float(data['bust'])
        waist = float(data['waist'])
        high_hip = float(data['highHip'])
        hip = float(data['hip'])
        shoulder = float(data['shoulder'])
    except ValueError:
        return jsonify({"error": "All measurements must be numeric"}), 400

    body_shape = determine_body_shape(bust, waist, high_hip, hip, shoulder)
    waist_hip_ratio = round(waist / hip, 2)
    print(body_shape, waist_hip_ratio)

    # Find the matching body shape in the DataFrame
    shape_data = body_shape_df[body_shape_df["Name"] == body_shape].fillna("").to_dict(orient="records")
    print('shape_data - ', shape_data)

    # return jsonify({"bodyShape": body_shape, "waistHipRatio": waist_hip_ratio})

    if shape_data:
        # Parse the Recommendations string into a Python list
        shape_data[0]["Recommendations"] = ast.literal_eval(shape_data[0]["Recommendations"])
        return jsonify({"bodyShape": body_shape, "data": shape_data[0], "waistHipRatio": waist_hip_ratio})  # Return first match with parsed Recommendations
    else:
        return jsonify({"error": "Body shape not found"}), 404


# Function to determine body shape
def determine_body_shape(bust, waist, high_hip, hips, shoulder):
    # Input validation
    measurements = [bust, waist, high_hip, hips, shoulder]
    if any(m <= 0 for m in measurements):
        raise ValueError("All measurements must be positive numbers")

    # Calculate ratios and round to 2 decimal places
    shr = round(shoulder / hips, 2)    # Shoulder to hip ratio
    whr = round(waist / hips, 2)       # Waist to hip ratio
    hhr = round(high_hip / hips, 2)    # High hip to hip ratio

    print(f"SHR: {shr}, WHR: {whr}, HHR: {hhr}")

    # Define body shapes with adjusted ranges
    if 0.90 <= shr <= 1.10 and 0.65 <= whr <= 0.85 and 0.85 <= hhr <= 0.95:
        return "Hourglass"  # Balanced upper/lower, defined waist, gradual hip taper
    elif shr < 0.90 and whr > 0.75 and hhr >= 0.90:
        return "Pear"       # Wider hips, moderate waist, fuller lower body
    elif shr > 1.10 and whr > 0.85 and hhr < 0.95:
        return "Apple"      # Wider upper body, less defined waist, narrower hips
    elif 0.90 <= shr <= 1.10 and whr > 0.85 and 0.85 <= hhr <= 0.95:
        return "Rectangle"  # Balanced upper/lower, straighter waist
    elif shr > 1.10 and whr < 0.75 and hhr < 0.90:
        return "Inverted Triangle"  # Broad upper body, defined waist, narrower hips
    else:
        return "Unique Shape"  # Catch-all for other combinations
    

def classify_body_shape(answers):
    # Logic to classify body shape based on answers
    if answers["widestPart"] == "hips":
        return "Pear"
    elif answers["widestPart"] == "bust":
        return "Inverted Triangle"
    elif answers["widestPart"] == "middle":
        return "Apple"
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
    print("body_shape_quiz function called")
    data = request.get_json()
    print("data - ", data)
    if not data:
        return jsonify({"error": "Invalid input data"}), 400
    
    body_shape = classify_body_shape(data)
    print('body shape', body_shape)

    # Find the matching body shape in the DataFrame
    shape_data = body_shape_df[body_shape_df["Name"] == body_shape].fillna("").to_dict(orient="records")
    print('shape_data - ', shape_data)

    if shape_data:
        # Parse the Recommendations string into a Python list
        shape_data[0]["Recommendations"] = ast.literal_eval(shape_data[0]["Recommendations"])
        return jsonify({"bodyShape": body_shape, "data": shape_data[0]})  # Return first match with parsed Recommendations
    else:
        return jsonify({"error": "Body shape not found"}), 404

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

# Flask route for prediction
@app.route('/predict-skin-tone', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    # Read image file
    try:
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({'error': 'Invalid image'}), 400
        
        # Predict skin tone
        predicted_skin_tone = predict_skin_tone(skintone_model, image)
        return jsonify({'skin_tone': predicted_skin_tone})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/occasions', methods=['GET'])
def getAllOccasions():
    occasion = occasions.fillna("").to_dict(orient="records")
    return jsonify(occasion)

@app.route('/occasions/<occ_name>', methods=['GET'])
def getOccasionsByName(occ_name):
    matching_products = occasions[occasions['occasion'] == occ_name]

    # Handle empty results
    if matching_products.empty:
        return jsonify({"error": "Product not found"}), 404

    # Convert DataFrame row to JSON
    occasion_data = matching_products.to_dict(orient="records")[0]

    # print(occasion_data)  

    # Extract category names from the 'cats' array and convert to lowercase
    categories = [cat["category"].lower() for cat in occasion_data.get("cats", [])]

    print("categories", categories)

    # Convert Individual_category to lowercase and filter dataset_df
    dataset_df["Individual_category_lower"] = dataset_df["Individual_category"].str.lower()
    filtered_products = dataset_df[dataset_df["Individual_category_lower"].isin(categories)]

    return jsonify({
        "filtered_products": filtered_products.drop(columns=["Individual_category_lower"]).fillna("").to_dict(orient="records"),
        "categories": categories  # Fix: Return the categories list, not filtered_category
    })

@app.route('/prices/<price>', methods=['GET'])
def getProductsByPrice(price):

    # Convert price to float for comparison
    price = float(price)

    print(type(price))
    print(type(dataset_df["OriginalPrice"]))

    matching_products = dataset_df[dataset_df['OriginalPrice'] <= price]

     # Convert DataFrame row to JSON
    product_data = matching_products.fillna("").to_dict(orient="records")

    return jsonify(product_data)

@app.route('/')
def home():
    return {'name' : 'Welcome to the Cloth Recommendation System!'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)  