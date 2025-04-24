/**
 * TechCareerMatch - Skill Analysis Integration
 * This script integrates the Python data analysis with the web application.
 */

const SkillAnalysisIntegration = {
    /**
     * Initialize the skill analysis integration
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function () {
        try {
            console.log('SkillAnalysisIntegration initialized');

            // Set up event listeners
            this._setupEventListeners();

            return true;
        } catch (error) {
            console.error('Error initializing SkillAnalysisIntegration:', error);
            return false;
        }
    },

    /**
     * Set up event listeners
     * @private
     */
    _setupEventListeners: function () {
        // Listen for profile updates to refresh visualizations
        document.addEventListener('profile-updated', this.refreshVisualizations.bind(this));

        // Listen for resume uploads to refresh visualizations
        document.addEventListener('resume-processed', this.refreshVisualizations.bind(this));

        // Listen for tab changes to refresh visualizations when skills tab is selected
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const contentId = item.getAttribute('data-content');
                if (contentId === 'skills') {
                    // Small delay to ensure content is loaded
                    setTimeout(() => {
                        this.refreshVisualizations();
                    }, 300);
                }
            });
        });
    },

    /**
     * Simulate calling an API to the Python analysis script
     * In a real implementation, this would make an actual API call
     * @param {Object} profile - User profile
     * @param {Array} skills - User skills
     * @param {string} resumeText - Resume text (optional)
     * @returns {Promise<Object>} Analysis data
     * @private
     */
    _callAnalysisAPI: async function (profile, skills, resumeText = null) {
        try {
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile: profile,
                    resume_text: resumeText || ''
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const analysisData = await response.json();
            return analysisData;
        } catch (error) {
            console.error('Error calling analysis API:', error);
            // Fallback to simulated data if API call fails
            await new Promise(resolve => setTimeout(resolve, 1500));
            const jobData = this._getJobListingsData();
            const analysisData = {
                skill_match: {
                    skills: skills,
                    demand_values: skills.map(() => Math.floor(Math.random() * 70) + 30)
                },
                job_locations: {
                    states: Object.keys(jobData.state_distribution).slice(0, 10),
                    job_counts: Object.values(jobData.state_distribution).slice(0, 10)
                },
                salary_trends: {
                    exp_ranges: ["0-2 years", "2-5 years", "5-8 years", "8+ years"],
                    salaries: [70000, 90000, 115000, 140000],
                    user_experience: profile.experience || null
                },
                education_certification: {
                    education_distribution: {
                        "Bachelor's": 45,
                        "Master's": 30,
                        "PhD": 10,
                        "Self-taught": 12,
                        "Bootcamp": 3
                    },
                    certification_impact: {
                        "With Certifications": 110000,
                        "Without Certifications": 95000
                    }
                },
                skill_gap_data: this._generateSkillGapData(skills)
            };
            return analysisData;
        }
    },

    /**
     * Get job listings data from the dataset
     * In a real implementation, this would read from the actual dataset
     * @returns {Object} Job listings data
     * @private
     */
    _getJobListingsData: function () {
        // Simulated dataset statistics based on the job_listings_with_states.csv
        return {
            state_distribution: {
                "California": 782,
                "Texas": 563,
                "New York": 489,
                "Massachusetts": 312,
                "Washington": 287,
                "Illinois": 245,
                "Georgia": 203,
                "Colorado": 187,
                "Florida": 169,
                "North Carolina": 158,
                "Virginia": 146,
                "Pennsylvania": 138,
                "New Jersey": 132,
                "Ohio": 124,
                "Michigan": 118
            },
            roles_distribution: {
                "Software Developer": 1247,
                "Data Scientist": 583,
                "Frontend Developer": 412,
                "Backend Developer": 398,
                "Full Stack Developer": 375,
                "DevOps Engineer": 289,
                "Mobile App Developer": 214,
                "UI/UX Designer": 167,
                "Product Manager": 98,
                "QA Engineer": 75
            },
            salary_by_experience: {
                "0-2": 72500,
                "2-5": 95000,
                "5-8": 125000,
                "8+": 152000
            }
        };
    },

    /**
     * Generate realistic skill gap data
     * @param {Array} userSkills - User skills
     * @returns {Object} Skill gap data
     * @private
     */
    _generateSkillGapData: function (userSkills) {
        // Common in-demand tech skills
        const commonSkills = [
            'JavaScript', 'Python', 'React', 'AWS', 'SQL', 'Node.js',
            'TypeScript', 'Docker', 'Kubernetes', 'Java', 'Git',
            'Machine Learning', 'DevOps', 'Cloud', 'REST API',
            'NoSQL', 'CI/CD', 'Microservices', 'GraphQL'
        ];

        // Convert user skills to lowercase for case-insensitive matching
        const userSkillsLower = userSkills.map(skill => skill.toLowerCase());

        // Generate skill gap data
        const skillGapData = {};

        commonSkills.forEach(skill => {
            // Check if user has this skill
            const hasSkill = userSkillsLower.some(userSkill =>
                userSkill.toLowerCase() === skill.toLowerCase()
            );

            // Generate random demand value (higher for more common skills)
            let demand;
            if (['JavaScript', 'Python', 'React', 'AWS', 'SQL'].includes(skill)) {
                demand = Math.floor(Math.random() * 30) + 70; // 70-100%
            } else if (['TypeScript', 'Node.js', 'Java', 'Git'].includes(skill)) {
                demand = Math.floor(Math.random() * 30) + 60; // 60-90%
            } else {
                demand = Math.floor(Math.random() * 40) + 40; // 40-80%
            }

            skillGapData[skill.toLowerCase()] = {
                demand: demand,
                has_skill: hasSkill
            };
        });

        return skillGapData;
    },

    /**
     * Update the skill analysis UI with visualization data
     * @param {Object} analysisData - Analysis data
     * @private
     */
    _updateSkillAnalysisUI: function (analysisData) {
        // Create and update charts
        this._createSkillMatchChart(analysisData.skill_match);
        this._createJobLocationsChart(analysisData.job_locations);
        this._createSalaryTrendsChart(analysisData.salary_trends);
        this._createEducationCertificationCharts(analysisData.education_certification);
    },

    /**
     * Create skill match chart
     * @param {Object} data - Skill match data
     * @private
     */
    _createSkillMatchChart: function (data) {
        const ctx = document.getElementById('skill-value-chart');
        if (!ctx) return;

        // Prepare chart data
        const skills = data.skills.slice(0, 10); // Limit to top 10 skills
        const demandValues = data.demand_values.slice(0, 10);

        // Sort by demand value (highest first)
        const sortedIndices = demandValues.map((value, index) => ({ value, index }))
            .sort((a, b) => b.value - a.value)
            .map(item => item.index);

        const sortedSkills = sortedIndices.map(index => skills[index]);
        const sortedValues = sortedIndices.map(index => demandValues[index]);

        // Create or update chart
        if (window.skillValueChart) {
            window.skillValueChart.destroy();
        }

        window.skillValueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedSkills,
                datasets: [{
                    label: 'Market Value',
                    data: sortedValues,
                    backgroundColor: sortedValues.map(value => this._getValueColor(value)),
                    borderColor: sortedValues.map(value => this._getValueColor(value)),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Value Score'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.raw;
                                return `Value: ${value}/100`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Create job locations chart
     * @param {Object} data - Job locations data
     * @private
     */
    _createJobLocationsChart: function (data) {
        // Get or create a canvas element for the chart
        let canvasElement = document.getElementById('job-locations-chart');

        if (!canvasElement) {
            // Get the skill analysis container
            const container = document.querySelector('.skills-dashboard');
            if (!container) return;

            // Create a new card for job locations
            const cardElement = document.createElement('div');
            cardElement.className = 'skill-analysis-card';
            cardElement.innerHTML = `
              <div class="card-header">
                  <h3>Job Opportunities by Location</h3>
              </div>
              <div class="card-body">
                  <canvas id="job-locations-chart"></canvas>
              </div>
          `;

            // Add the card to the container
            container.appendChild(cardElement);

            // Get the canvas element
            canvasElement = document.getElementById('job-locations-chart');
        }

        // Prepare chart data
        const states = data.states;
        const jobCounts = data.job_counts;

        // Create or update chart
        if (window.jobLocationsChart) {
            window.jobLocationsChart.destroy();
        }

        window.jobLocationsChart = new Chart(canvasElement, {
            type: 'bar',
            data: {
                labels: states,
                datasets: [{
                    label: 'Number of Jobs',
                    data: jobCounts,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Jobs'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Jobs: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Create salary trends chart
     * @param {Object} data - Salary trends data
     * @private
     */
    _createSalaryTrendsChart: function (data) {
        // Using the existing experience-salary chart if available
        const ctx = document.getElementById('experience-salary-chart');
        if (!ctx) return;

        // Prepare chart data
        const expRanges = data.exp_ranges;
        const salaries = data.salaries;
        const userExperience = data.user_experience;

        // Create datasets
        const datasets = [
            {
                label: 'Average Salary',
                data: salaries,
                backgroundColor: CONFIG.charts.colors.primary,
                borderColor: CONFIG.charts.colors.primary,
                tension: 0.3,
                fill: false
            }
        ];

        // Add user position if available
        if (userExperience !== null) {
            // Find the appropriate bin for user's experience
            let userBin = 0;
            if (userExperience < 2) {
                userBin = 0;
            } else if (userExperience < 5) {
                userBin = 1;
            } else if (userExperience < 8) {
                userBin = 2;
            } else {
                userBin = 3;
            }

            // Create user position dataset
            const userPositionData = Array(expRanges.length).fill(null);
            userPositionData[userBin] = salaries[userBin];

            datasets.push({
                label: `Your Position (${userExperience} years)`,
                data: userPositionData,
                pointBackgroundColor: CONFIG.charts.colors.warning,
                pointBorderColor: CONFIG.charts.colors.warning,
                pointRadius: 8,
                pointHoverRadius: 10,
                type: 'scatter'
            });
        }

        // Create or update chart
        if (window.experienceSalaryChart) {
            window.experienceSalaryChart.destroy();
        }

        window.experienceSalaryChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: expRanges,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Salary ($)'
                        },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Years of Experience'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const datasetLabel = context.dataset.label || '';
                                const value = context.raw;

                                if (value !== null) {
                                    return `${datasetLabel}: $${value.toLocaleString()}`;
                                } else {
                                    return datasetLabel;
                                }
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Create education and certification charts
     * @param {Object} data - Education and certification data
     * @private
     */
    _createEducationCertificationCharts: function (data) {
        // Get or create canvas elements for the charts
        let educationCanvas = document.getElementById('education-chart');
        let certificationCanvas = document.getElementById('certification-chart');

        if (!educationCanvas || !certificationCanvas) {
            // Get the skill analysis container
            const container = document.querySelector('.skills-dashboard');
            if (!container) return;

            // Create a new card for education and certification
            const cardElement = document.createElement('div');
            cardElement.className = 'skill-analysis-card';
            cardElement.innerHTML = `
              <div class="card-header">
                  <h3>Education & Certification Impact</h3>
              </div>
              <div class="card-body" style="display: flex; flex-direction: column; gap: 20px;">
                  <div style="flex: 1; min-height: 200px;">
                      <canvas id="education-chart"></canvas>
                  </div>
                  <div style="flex: 1; min-height: 200px;">
                      <canvas id="certification-chart"></canvas>
                  </div>
              </div>
          `;

            // Add the card to the container
            container.appendChild(cardElement);

            // Get the canvas elements
            educationCanvas = document.getElementById('education-chart');
            certificationCanvas = document.getElementById('certification-chart');
        }

        // Prepare education data
        const eduLabels = Object.keys(data.education_distribution);
        const eduValues = Object.values(data.education_distribution);

        // Create or update education chart
        if (window.educationChart) {
            window.educationChart.destroy();
        }

        window.educationChart = new Chart(educationCanvas, {
            type: 'pie',
            data: {
                labels: eduLabels,
                datasets: [{
                    data: eduValues,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(243, 156, 18, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Education Level Distribution'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });

        // Prepare certification data
        const certLabels = Object.keys(data.certification_impact);
        const certValues = Object.values(data.certification_impact);

        // Create or update certification chart
        if (window.certificationChart) {
            window.certificationChart.destroy();
        }

        window.certificationChart = new Chart(certificationCanvas, {
            type: 'bar',
            data: {
                labels: certLabels,
                datasets: [{
                    label: 'Average Salary',
                    data: certValues,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(149, 165, 166, 0.7)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(149, 165, 166, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Salary ($)'
                        },
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Impact of Certifications on Salary'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const value = context.raw;
                                return `Salary: $${value.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Update skill gap section
     * @param {Object} skillGapData - Skill gap data
     * @private
     */
    _updateSkillGapSection: function (skillGapData) {
        const container = document.getElementById('skill-gaps-container');
        if (!container) return;

        // Clear previous content
        container.innerHTML = '';

        // Sort skills by demand (highest first)
        const sortedSkills = Object.entries(skillGapData)
            .sort((a, b) => b[1].demand - a[1].demand);

        // Create skill gap items
        sortedSkills.forEach(([skill, data]) => {
            const skillGapItem = document.createElement('div');
            skillGapItem.className = 'skill-gap-item';

            skillGapItem.innerHTML = `
              <div class="skill-info">
                  <div class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</div>
                  <div class="skill-demand">Market Demand: ${Math.round(data.demand)}/100</div>
                  <div class="skill-progress">
                      <div class="skill-progress-bar" style="width: ${data.has_skill ? '100' : '0'}%; 
                          background-color: ${data.has_skill ? '#2ecc71' : '#e74c3c'}"></div>
                  </div>
              </div>
              <div class="skill-action">
                  ${data.has_skill ?
                    '<span style="color: #2ecc71;"><i class="fas fa-check-circle"></i> You have this skill</span>' :
                    '<button class="learn-btn">Learn</button>'}
              </div>
          `;

            container.appendChild(skillGapItem);
        });

        // Add event listeners to learn buttons
        const learnButtons = container.querySelectorAll('.learn-btn');
        learnButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Switch to roadmap tab to show learning path
                const roadmapNavItem = document.querySelector('.nav-item[data-content="roadmap"]');
                if (roadmapNavItem) {
                    roadmapNavItem.click();
                }
            });
        });
    },

    /**
     * Get color based on value
     * @param {number} value - Value (0-100)
     * @returns {string} Color in rgba format
     * @private
     */
    _getValueColor: function (value) {
        // Calculate color gradient from red to green
        let r, g;

        if (value < 50) {
            // Red to yellow
            r = 255;
            g = Math.round(5.1 * value);
        } else {
            // Yellow to green
            r = Math.round(510 - 5.1 * value);
            g = 255;
        }

        return `rgba(${r}, ${g}, 0, 0.7)`;
    },

    /**
     * Refresh visualizations based on current user data
     */
    refreshVisualizations: async function () {
        try {
            // Show loading notification
            Utils.showNotification(
                'Analyzing',
                'Generating skill analysis visualizations...',
                'info',
                3000
            );

            // Get user profile and skills
            const profile = await DataManager.getUserProfile();
            const userSkills = await DataManager.getUserSkills();

            // Extract skills as a list
            const skillsList = userSkills.map(skill => skill.name);

            // Get resume text if available
            let resumeText = null;
            try {
                const resumeData = await StorageManager.getResumeFile();
                if (resumeData && resumeData.resumeText) {
                    resumeText = resumeData.resumeText;
                }
            } catch (error) {
                console.log('No resume found or error retrieving resume text:', error);
            }

            // Call the Python analysis script via our API simulation
            const analysisData = await this._callAnalysisAPI(profile, skillsList, resumeText);

            // Display the visualizations in the UI
            this._updateSkillAnalysisUI(analysisData);

            // Update the skill gap section
            if (analysisData.skill_gap_data) {
                this._updateSkillGapSection(analysisData.skill_gap_data);
            }

            Utils.showNotification(
                'Analysis Complete',
                'Skill analysis visualizations have been updated.',
                'success'
            );
        } catch (error) {
            console.error('Error refreshing visualizations:', error);
            Utils.showNotification(
                'Error',
                'Failed to generate skill analysis visualizations.',
                'error'
            );
        }
    }
};