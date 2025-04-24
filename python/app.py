from flask import Flask, request, jsonify
from flask_cors import CORS
from tech_career_analyzer import TechCareerAnalyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

analyzer = TechCareerAnalyzer('data/job_listings_with_states.csv')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    user_profile = data.get('profile', {})
    resume_text = data.get('resume_text', '')
    
    visualizations = analyzer.generate_all_visualizations(user_profile, resume_text)
    return jsonify(visualizations)

if __name__ == '__main__':
    app.run(debug=True, port=5000)