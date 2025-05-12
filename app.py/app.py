from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)  # ✅ Correction ici
CORS(app)

# Connexion à la base de données
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="parc-info"
    )

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM auth_users WHERE email=%s AND password=%s"
    cursor.execute(query, (email, password))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify({
            "email": user["email"],
            "role": user["role"],
            "token": "fake-jwt-token"  # Tu peux remplacer par un vrai JWT si tu veux
        })
    else:
        return jsonify({"message": "Identifiants invalides"}), 401

# ✅ Correction ici aussi
if __name__ == "__main__":
    app.run(debug=True)
