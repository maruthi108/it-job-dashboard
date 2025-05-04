# TechCareerMatch

![TechCareerMatch Logo](assets/img/logo.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)](https://www.python.org/)
[![Data Analysis](https://img.shields.io/badge/Data%20Analysis-Pandas-green.svg)](https://pandas.pydata.org/)

## 📋 Overview

TechCareerMatch is an intelligent career platform designed specifically for IT professionals. The application matches users with suitable job opportunities based on their skills, experience, and preferences, while providing valuable insights into skill gaps and market trends. Whether you're actively job hunting or planning your career growth, TechCareerMatch provides data-driven guidance for your professional journey.

### 🎯 Key Features

- **Personalized Job Matching**: Sophisticated algorithm to match IT professionals with relevant job opportunities
- **Skill Gap Analysis**: Identifies missing skills based on target roles and market demand
- **Career Roadmap Planning**: Visualizes career progression paths and provides development timelines
- **Resume Parsing**: Automatically extracts and analyzes skills from uploaded resumes
- **Data Visualization**: Interactive charts and graphs showcasing job market trends and salary insights
- **Profile Management**: Comprehensive profile management with skill tracking and work experience history


## 🖼️ Screenshots

<div align="center">
  <img src="![Screenshot 2025-05-04 095911](https://github.com/user-attachments/assets/5a5040f2-1900-4c9c-8b02-4cda7380545c)
" alt="Dashboard" width="45%" />
  <img src="![Screenshot 2025-05-04 095954](https://github.com/user-attachments/assets/6dcebb50-85bc-4fc7-bd0f-22bf50889375)
" alt="Job Market Analysis Dashboard" width="45%" />
</div>

<div align="center">
  <img src="![Screenshot 2025-05-04 100255](https://github.com/user-attachments/assets/b9ae45c6-a01e-48ec-9068-9965a31950d3)
" alt="Job Matches" width="45%" />
  <img src="![Screenshot 2025-05-04 100410](https://github.com/user-attachments/assets/4b44a5eb-c3b5-4951-beca-4b50a2201ae7)
" alt="Career Roadmap" width="45%" />
</div>

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js
- **Data Visualization**: Chart.js, D3.js
- **Data Analysis**: Python, Pandas, NumPy, Matplotlib, Seaborn
- **Storage**: LocalForage for client-side persistence
- **CSS Framework**: Custom responsive CSS
- **File Handling**: Client-side File API

## 📊 Data Analysis

The application uses sophisticated data analysis techniques to:

1. Match user profiles with suitable job opportunities
2. Identify skill gaps based on market demand
3. Generate personalized career development paths
4. Analyze salary trends across roles and experience levels
5. Create skill correlation matrices to recommend complementary skills

## ⚡ Getting Started

### Prerequisites

- Python 3.7+ (for data preprocessing)
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 14+ (optional, for local development server)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/techcareermatch.git
   cd techcareermatch
   ```

2. Install Python dependencies for data processing:
   ```bash
   pip install -r requirements.txt
   ```

3. Generate sample data (optional):
   ```bash
   cd preprocessing
   python job_generator.py
   ```

4. Run the application:
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   
   # Or using Node.js http-server
   npx http-server -p 8000
   ```

5. Open your browser and navigate to `http://localhost:8000`

## 📂 Project Structure

```
TechCareerMatch/
├── index.html                 # Main HTML file
├── css/                       # CSS stylesheets
│   ├── styles.css             # Main stylesheet
│   ├── responsive.css         # Responsive design
│   └── skill-analysis.css     # Skill analysis dashboard
├── js/                        # JavaScript files
│   ├── app.js                 # Main application
│   ├── api.js                 # API functions
│   ├── charts.js              # Chart visualizations
│   ├── data.js                # Data management
│   ├── matching.js            # Job matching
│   ├── profile.js             # Profile management
│   ├── roadmap.js             # Career roadmap
│   ├── storage-manager.js     # Storage management
│   └── utils.js               # Utility functions
├── data/                      # Data files
│   └── job_listings.csv       # Job listings data
├── preprocessing/             # Data processing scripts
│   ├── data_validation.py     # Data validation
│   ├── job_generator.py       # Sample data generator
│   └── data_analysis.py       # Data analysis
├── assets/                    # Static assets
│   ├── img/                   # Images and icons
│   └── icons/                 # Application icons
└── docs/                      # Documentation
    ├── user_guide.md          # User guide
    └── setup_guide.md         # Setup instructions
```

## 🔧 Data Preprocessing

The repository includes Python scripts for data preparation:

1. `job_generator.py`: Creates realistic sample data with 5,000 job listings
2. `data_validation.py`: Cleans and validates job data
3. `data_analysis.py`: Generates insights and visualizations from job data

To run the analysis and generate visualizations:

```bash
cd preprocessing
python data_analysis.py --input ../data/job_listings.csv
```

## 💻 Usage

1. **Profile Setup**:
   - Create your profile with basic information
   - Add your technical skills and experience
   - Upload your resume for automatic skill extraction

2. **Job Matching**:
   - View personalized job matches based on your profile
   - Filter jobs by role, location, experience level, and salary range
   - Save interesting jobs for later

3. **Skill Analysis**:
   - View your skill distribution compared to market demand
   - Identify skill gaps for your target role
   - Get recommendations for skill acquisition

4. **Career Roadmap**:
   - Explore career progression paths
   - View skill development timeline
   - Analyze experience-salary relationships

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please check out our [contribution guidelines](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Project Link: [https://github.com/maruthi108/techcareermatch](https://github.com/yourusername/techcareermatch)

## 🙏 Acknowledgements

- [Chart.js](https://www.chartjs.org/) for data visualization
- [LocalForage](https://localforage.github.io/localForage/) for client-side storage
- [Pandas](https://pandas.pydata.org/) for data analysis
- [Font Awesome](https://fontawesome.com/) for icons
- All the contributors who have helped this project evolve
