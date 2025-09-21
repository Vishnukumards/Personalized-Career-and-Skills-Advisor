from flask import Flask, request, jsonify
from model import model # Import the model instance

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # The features the model was trained on
        user_features = {
            'userType': data.get('userType'),
            'interest': data.get('interest'),
            'skill_interest': data.get('skill_interest')
        }

        prediction = model.predict(user_features)
        return jsonify({"predictedCareerPath": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)