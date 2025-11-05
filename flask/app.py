from flask import Flask, jsonify, request

app = Flask(__name__)

# Route home
@app.route('/')
def home():
    return "Hello, Flask!"

# Route API contoh
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"name": "Azhar", "role": "Backend Developer"}
    return jsonify(data)

# Route API untuk POST
@app.route('/api/data', methods=['POST'])
def post_data():
    content = request.json
    return jsonify({"you_sent": content}), 201

if __name__ == '__main__':
    app.run(debug=True)
