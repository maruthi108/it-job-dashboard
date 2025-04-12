/**
 * Charts and data visualization for TechCareerMatch
 */

const ChartManager = {
    /**
     * Initialize chart manager
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function() {
        try {
            // Set global Chart.js options
            Chart.defaults.font.family = CONFIG.charts.fontFamily;
            Chart.defaults.animation.duration = CONFIG.charts.defaultAnimationDuration;
            Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            Chart.defaults.plugins.tooltip.titleFont.weight = 'bold';
            Chart.defaults.plugins.legend.labels.usePointStyle = true;
            
            console.log('ChartManager initialized');
            return true;
        } catch (error) {
            console.error('Error initializing ChartManager:', error);
            return false;
        }
    },
    
    /**
     * Create dashboard charts
     * @param {Object} dashboardData - Dashboard data
     */
    createDashboardCharts: function(dashboardData) {
        this.createSkillDemandChart(dashboardData.skillDemandData);
        this.createSalaryByRoleChart(dashboardData.salaryData);
    },
    
    /**
     * Create skills demand chart
     * @param {Array} skillData - Skill demand data
     */
    createSkillDemandChart: function(skillData) {
        const ctx = document.getElementById('skills-chart');
        
        if (!ctx) return;
        
        // If chart already exists, destroy it
        if (this.skillsChart) {
            this.skillsChart.destroy();
        }
        
        // Sort skills by demand (highest first)
        const sortedSkills = [...skillData].sort((a, b) => b.demand - a.demand);
        
        // Prepare chart data
        const labels = sortedSkills.map(skill => skill.name);
        const demandData = sortedSkills.map(skill => skill.demand);
        const growthData = sortedSkills.map(skill => skill.growth);
        
        // Create chart
        this.skillsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Current Demand',
                        data: demandData,
                        backgroundColor: CONFIG.charts.colors.primary,
                        borderColor: CONFIG.charts.colors.primary,
                        borderWidth: 1
                    },
                    {
                        label: 'Annual Growth (%)',
                        data: growthData,
                        backgroundColor: CONFIG.charts.colors.secondary,
                        borderColor: CONFIG.charts.colors.secondary,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Demand Score / Growth %'
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw;
                                
                                if (label === 'Current Demand') {
                                    return `Demand: ${value}/100`;
                                } else {
                                    return `Growth: ${value}%`;
                                }
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create salary by role chart
     * @param {Array} salaryData - Salary data
     */
    createSalaryByRoleChart: function(salaryData) {
        const ctx = document.getElementById('salary-chart');
        
        if (!ctx) return;
        
        // If chart already exists, destroy it
        if (this.salaryChart) {
            this.salaryChart.destroy();
        }
        
        // Sort by salary (highest first)
        const sortedData = [...salaryData].sort((a, b) => b.salary - a.salary);
        
        // Prepare chart data
        const labels = sortedData.map(item => item.role);
        const salaries = sortedData.map(item => item.salary);
        
        // Create chart
        this.salaryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Average Salary',
                    data: salaries,
                    backgroundColor: CONFIG.charts.colors.accent,
                    borderColor: CONFIG.charts.colors.accent,
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
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return 'Salary: $' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create skill radar chart
     * @param {Array} skills - User skills with demand data
     */
    createSkillRadarChart: function(skills) {
        const ctx = document.getElementById('skill-radar-chart');
        
        if (!ctx) return;
        
        // If chart already exists, destroy it
        if (this.skillRadarChart) {
            this.skillRadarChart.destroy();
        }
        
        if (!skills || skills.length === 0) {
            return;
        }
        
        // Limit to top skills for readability
        const topSkills = skills.slice(0, 8);
        
        // Prepare chart data
        const labels = topSkills.map(skill => skill.name);
        const skillLevels = topSkills.map(skill => this._getSkillLevelValue(skill.level));
        const demandLevels = topSkills.map(skill => skill.demand);
        
        // Create chart
        this.skillRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Your Proficiency',
                        data: skillLevels,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: CONFIG.charts.colors.primary,
                        pointBackgroundColor: CONFIG.charts.colors.primary,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: CONFIG.charts.colors.primary
                    },
                    {
                        label: 'Market Demand',
                        data: demandLevels,
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: CONFIG.charts.colors.secondary,
                        pointBackgroundColor: CONFIG.charts.colors.secondary,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: CONFIG.charts.colors.secondary
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw;
                                
                                if (label === 'Your Proficiency') {
                                    return `Proficiency: ${value}%`;
                                } else {
                                    return `Demand: ${value}/100`;
                                }
                            }
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Create skill value chart
     * @param {Array} skills - User skills with value data
     */
    createSkillValueChart: function(skills) {
        const ctx = document.getElementById('skill-value-chart');
        
        if (!ctx) return;
        
        // If chart already exists, destroy it
        if (this.skillValueChart) {
            this.skillValueChart.destroy();
        }
        
        if (!skills || skills.length === 0) {
            return;
        }
        
        // Sort by value (highest first)
        const sortedSkills = [...skills].sort((a, b) => b.value - a.value);
        
        // Limit to top skills for readability
        const topSkills = sortedSkills.slice(0, 8);
        
        // Prepare chart data
        const labels = topSkills.map(skill => skill.name);
        const values = topSkills.map(skill => skill.value);
        
        // Create color gradient based on value
        const colors = values.map(value => this._getValueColor(value));
        
        // Create chart
        this.skillValueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Market Value',
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors,
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
                            label: function(context) {
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
     * Create experience-salary chart
     * @param {Array} data - Experience-salary data
     */
    createExperienceSalaryChart: function(data) {
        const ctx = document.getElementById('experience-salary-chart');
        
        if (!ctx) return;
        
        // If chart already exists, destroy it
        if (this.experienceSalaryChart) {
            this.experienceSalaryChart.destroy();
        }
        
        if (!data || data.length === 0) {
            return;
        }
        
        // Prepare chart data
        const sortedData = [...data].sort((a, b) => a.years - b.years);
        const labels = sortedData.map(item => `${item.years} ${item.years === 1 ? 'year' : 'years'}`);
        const salaries = sortedData.map(item => item.salary);
        
        // Check if we have current values
        const currentExperience = data.currentExperience;
        const currentSalary = data.currentSalary;
        
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
        
        // Add current point if available
        if (currentExperience !== undefined && currentSalary !== undefined) {
            // Find closest points
            const pointIndex = sortedData.findIndex(item => item.years >= currentExperience);
            
            if (pointIndex !== -1) {
                datasets.push({
                    label: 'Your Current Position',
                    data: Array(sortedData.length).fill(null),
                    pointBackgroundColor: CONFIG.charts.colors.warning,
                    pointBorderColor: CONFIG.charts.colors.warning,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    type: 'scatter'
                });
                
                // Set the current point
                datasets[1].data[pointIndex] = currentSalary;
            }
        }
        
        // Create chart
        this.experienceSalaryChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets
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
                            callback: function(value) {
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
                            label: function(context) {
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
     * Convert skill level to percentage value
     * @param {string} level - Skill level
     * @returns {number} Percentage value
     * @private
     */
    _getSkillLevelValue: function(level) {
        switch (level) {
            case 'Beginner':
                return 25;
            case 'Intermediate':
                return 50;
            case 'Advanced':
                return 75;
            case 'Expert':
                return 100;
            default:
                return 0;
        }
    },
    
    /**
     * Get color based on value
     * @param {number} value - Value (0-100)
     * @returns {string} Color in rgba format
     * @private
     */
    _getValueColor: function(value) {
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
    }
};