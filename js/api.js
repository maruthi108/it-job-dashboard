/**
 * API functions for TechCareerMatch application
 * For now, these functions will simulate API calls using local data
 * In a production environment, they would make actual API requests
 */

const API = {
    /**
     * Initialize API module
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function () {
        try {
            console.log('API module initialized');
            return true;
        } catch (error) {
            console.error('API initialization error:', error);
            return false;
        }
    },

    /**
     * Simulate API delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after the delay
     */
    _delay: function (ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Get job matches based on user profile
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>} Job matches
     */
    getJobMatches: async function (filters = {}) {
        try {
            await this._delay(800);

            // Get user profile and skills
            const profile = await DataManager.getUserProfile();
            const userSkills = await DataManager.getUserSkills();
            const userSkillNames = userSkills.map(skill => skill.name);

            // Get sample job data
            let jobs = DataManager.getSampleJobs();


            // Sort by match score (highest first)
            jobs.sort((a, b) => (b.calculatedMatchScore || b.matchScore) - (a.calculatedMatchScore || a.matchScore));

            // Apply filters if provided
            if (Object.keys(filters).length > 0) {
                jobs = jobs.filter(job => {
                    // Role filter
                    if (filters.role && filters.role !== 'all' && !job.title.includes(filters.role)) {
                        return false;
                    }

                    // Location filter
                    if (filters.location && filters.location !== 'all') {
                        if (filters.location === 'Remote' && !job.location.includes('Remote')) {
                            return false;
                        } else if (filters.location === 'Hybrid' && !job.location.includes('Hybrid')) {
                            return false;
                        } else if (filters.location === 'On-site' && (job.location.includes('Remote') || job.location.includes('Hybrid'))) {
                            return false;
                        }
                    }

                    // Experience filter
                    if (filters.experience && filters.experience !== 'all') {
                        const jobExp = job.experience || '';

                        if (filters.experience === '0-2' && !jobExp.includes('0-') && !jobExp.includes('1-') && !jobExp.includes('0-2')) {
                            return false;
                        } else if (filters.experience === '2-5' && !jobExp.includes('2-') && !jobExp.includes('3-') && !jobExp.includes('4-')) {
                            return false;
                        } else if (filters.experience === '5-8' && !jobExp.includes('5-') && !jobExp.includes('6-') && !jobExp.includes('7-')) {
                            return false;
                        } else if (filters.experience === '8+' && !jobExp.includes('8+') && !jobExp.includes('8-') && !jobExp.includes('9-') && !jobExp.includes('10+')) {
                            return false;
                        }
                    }

                    // Salary filter
                    if (filters.salary && filters.salary !== 'all') {
                        const salaryStr = job.salary || '';
                        const salaryMatch = salaryStr.match(/\$(\d+),000/);

                        if (salaryMatch) {
                            const salary = parseInt(salaryMatch[1]) * 1000;

                            if (filters.salary === '0-50000' && salary > 50000) {
                                return false;
                            } else if (filters.salary === '50000-80000' && (salary < 50000 || salary > 80000)) {
                                return false;
                            } else if (filters.salary === '80000-120000' && (salary < 80000 || salary > 120000)) {
                                return false;
                            } else if (filters.salary === '120000+' && salary < 120000) {
                                return false;
                            }
                        }
                    }

                    // Search filter
                    if (filters.search && filters.search.trim() !== '') {
                        const searchTerm = filters.search.toLowerCase().trim();
                        const titleMatch = job.title.toLowerCase().includes(searchTerm);
                        const companyMatch = job.company.toLowerCase().includes(searchTerm);
                        const skillsMatch = job.skills.some(skill => skill.toLowerCase().includes(searchTerm));

                        if (!titleMatch && !companyMatch && !skillsMatch) {
                            return false;
                        }
                    }

                    return true;
                });
            }

            return jobs;
        } catch (error) {
            console.error('Error fetching job matches:', error);
            return [];
        }
    },
    // In api.js, add a method for role-based job filtering

    /**
 * Get job matches for a specific role category
 * @param {string} role - Role category (e.g., "Frontend Developer")
 * @returns {Promise<Array>} Matching jobs
 */
    getJobMatchesByCategory: async function (role) {
        try {
            await this._delay(500);

            // Map role names to ID prefixes
            const roleToPrefix = {
                'Frontend Developer': 'job_fe_',
                'Backend Developer': 'job_be_',
                'UI/UX Designer': 'job_ux_',
                'Full Stack Developer': 'job_fs_',
                'DevOps Engineer': 'job_do_',
                'Data Scientist': 'job_ds_',
                'Mobile App Developer': 'job_ma_'
            };

            // Get the prefix for this role
            let prefix = null;
            for (const [key, value] of Object.entries(roleToPrefix)) {
                if (role.includes(key)) {
                    prefix = value;
                    break;
                }
            }

            // Get all jobs
            const allJobs = typeof JobListingsData !== 'undefined' ?
                JobListingsData.getAllJobs() :
                DataManager.getSampleJobs();

            // Filter jobs by prefix if we have one
            let jobs = allJobs;
            if (prefix) {
                jobs = allJobs.filter(job => job.id.startsWith(prefix));
            } else {
                // Fallback to text search if no category match
                jobs = allJobs.filter(job =>
                    job.title.toLowerCase().includes(role.toLowerCase())
                );
            }


            return jobs;
        } catch (error) {
            console.error('Error fetching role-specific job matches:', error);
            return [];
        }
    },

    /**
     * Get related keywords for a role
     * @private
     */
    _getRelatedKeywords: function (role) {
        const roleLower = role.toLowerCase();

        // Map of related terms for common roles
        const relatedTermsMap = {
            'frontend': ['ui', 'react', 'angular', 'javascript', 'web'],
            'backend': ['api', 'server', 'node', 'python', 'java', 'database'],
            'fullstack': ['full stack', 'full-stack', 'frontend', 'backend'],
            'ui/ux': ['designer', 'design', 'user experience', 'interface'],
            'devops': ['infrastructure', 'cloud', 'aws', 'ci/cd', 'kubernetes'],
            'data scientist': ['machine learning', 'ai', 'analytics', 'statistics', 'python'],
            'mobile': ['ios', 'android', 'react native', 'swift', 'kotlin', 'app']
        };

        // Find matching keywords
        for (const [key, terms] of Object.entries(relatedTermsMap)) {
            if (roleLower.includes(key)) {
                return terms;
            }
        }

        return [roleLower]; // Default to the role itself if no matches
    },

    /**
     * Get skill analysis data
     * @returns {Promise<Object>} Skill analysis data
     */
    getSkillAnalysis: async function () {
        try {
            await this._delay(600);

            // Get user skills
            const userSkills = await DataManager.getUserSkills();

            // Get market demand data
            const marketDemand = DataManager.getSampleSkillsData();

            // Get skill gaps
            const skillGaps = DataManager.getSampleSkillGaps();

            // Map user skills to market demand
            const userSkillsWithDemand = userSkills.map(skill => {
                const marketData = marketDemand.find(item => item.name.toLowerCase() === skill.name.toLowerCase());

                return {
                    ...skill,
                    demand: marketData ? marketData.demand : 50,
                    growth: marketData ? marketData.growth : 5,
                    value: this._calculateSkillValue(skill, marketData)
                };
            });

            // Get target role requirements
            const targetRoleSkills = this._getTargetRoleSkills();

            return {
                userSkills: userSkillsWithDemand,
                marketDemand,
                skillGaps,
                targetRoleSkills
            };
        } catch (error) {
            console.error('Error fetching skill analysis:', error);
            return {
                userSkills: [],
                marketDemand: [],
                skillGaps: [],
                targetRoleSkills: []
            };
        }
    },

    /**
     * Calculate the value of a skill
     * @param {Object} skill - User skill
     * @param {Object} marketData - Market data for the skill
     * @returns {number} Skill value (0-100)
     */
    _calculateSkillValue: function (skill, marketData) {
        if (!marketData) {
            return 50; // Default value
        }

        const levelFactor = Utils.getSkillLevelIndex(skill.level) / 4; // 0.25 to 1
        const experienceFactor = Math.min(1, skill.experience / 5); // 0 to 1

        return Math.round(
            (marketData.demand * 0.6) +
            (marketData.growth * 3 * 0.2) +
            (levelFactor * 100 * 0.1) +
            (experienceFactor * 100 * 0.1)
        );
    },

    /**
     * Get skills required for target role
     * @returns {Array} Target role skills
     */
    _getTargetRoleSkills: function () {
        // This would ideally come from an API
        return [
            { name: 'JavaScript', level: 'Advanced', importance: 'Critical' },
            { name: 'React', level: 'Advanced', importance: 'Critical' },
            { name: 'TypeScript', level: 'Intermediate', importance: 'Important' },
            { name: 'HTML/CSS', level: 'Advanced', importance: 'Critical' },
            { name: 'Redux', level: 'Intermediate', importance: 'Important' },
            { name: 'Node.js', level: 'Intermediate', importance: 'Useful' },
            { name: 'Git', level: 'Intermediate', importance: 'Important' },
            { name: 'Testing', level: 'Intermediate', importance: 'Important' }
        ];
    },

    /**
     * Get learning paths
     * @returns {Promise<Array>} Learning paths
     */
    getLearningPaths: async function () {
        try {
            await this._delay(500);

            // Get user skills
            const userSkills = await DataManager.getUserSkills();
            const userSkillNames = userSkills.map(skill => skill.name);

            // Get sample learning paths
            const learningPaths = DataManager.getSampleLearningPaths();

            // Calculate relevance scores
            return learningPaths.map(path => {
                const relevanceScore = this._calculateLearningPathRelevance(path, userSkillNames);

                return {
                    ...path,
                    calculatedRelevance: relevanceScore
                };
            }).sort((a, b) => b.calculatedRelevance - a.calculatedRelevance);
        } catch (error) {
            console.error('Error fetching learning paths:', error);
            return [];
        }
    },

    /**
     * Calculate relevance score for a learning path
     * @param {Object} path - Learning path
     * @param {Array} userSkills - User skills
     * @returns {number} Relevance score (0-100)
     */
    _calculateLearningPathRelevance: function (path, userSkills) {
        // Count how many skills the user already has
        const knownSkills = path.skills.filter(skill =>
            userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        ).length;

        // Calculate how many new skills would be learned
        const newSkills = path.skills.length - knownSkills;

        // If user knows all the skills, the path is less relevant
        if (newSkills === 0) {
            return Math.max(40, path.relevance - 30);
        }

        // If user knows none of the skills, it might be too advanced
        if (knownSkills === 0) {
            return Math.min(80, path.relevance - 10);
        }

        // Ideal mix is knowing some skills but learning new ones
        return path.relevance + (newSkills * 2);
    },

    /**
     * Get career roadmap data
     * @returns {Promise<Object>} Roadmap data
     */
    getCareerRoadmap: async function () {
        try {
            await this._delay(700);

            // Get sample roadmap data
            return DataManager.getSampleRoadmap();
        } catch (error) {
            console.error('Error fetching career roadmap:', error);
            return {
                careerPath: [],
                timeline: [],
                experienceSalary: []
            };
        }
    },

    /**
     * Get dashboard data
     * @returns {Promise<Object>} Dashboard data
     */
    getDashboardData: async function () {
        try {
            await this._delay(600);

            // Get user profile and skills
            const profile = await DataManager.getUserProfile();
            const userSkills = await DataManager.getUserSkills();

            // Get top job matches
            const jobs = await this.getJobMatches();
            const topJobs = jobs.slice(0, 3);

            // Get market demand data
            const skillDemandData = DataManager.getSampleSkillsData();

            // Get salary data
            const salaryData = DataManager.getSampleSalaryData();

            // Calculate completion percentage
            const completionPercentage = Utils.calculateProfileCompletion(profile);

            // Get skill gap and market trend insights
            const skillGapInsight = this._getSkillGapInsight(userSkills, skillDemandData);
            const marketTrendInsight = this._getMarketTrendInsight(skillDemandData);

            return {
                profileCompletion: completionPercentage,
                topMatchScore: jobs.length > 0 ? (jobs[0].calculatedMatchScore || jobs[0].matchScore) : 0,
                skillsCount: userSkills.length,
                marketDemand: this._calculateAverageMarketDemand(userSkills, skillDemandData),
                salaryPotential: this._calculateSalaryPotential(userSkills, profile),
                topJobs,
                skillDemandData,
                salaryData,
                skillGapInsight,
                marketTrendInsight
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return {
                profileCompletion: 0,
                topMatchScore: 0,
                skillsCount: 0,
                marketDemand: 0,
                salaryPotential: 0,
                topJobs: [],
                skillDemandData: [],
                salaryData: [],
                skillGapInsight: '',
                marketTrendInsight: ''
            };
        }
    },

    /**
     * Calculate average market demand for user skills
     * @param {Array} userSkills - User skills
     * @param {Array} marketDemand - Market demand data
     * @returns {string} Average market demand score (out of 100)
     */
    _calculateAverageMarketDemand: function (userSkills, marketDemand) {
        if (!userSkills || userSkills.length === 0) {
            return '50/100';
        }

        let totalDemand = 0;
        let matchedSkills = 0;

        userSkills.forEach(skill => {
            const marketData = marketDemand.find(item => item.name.toLowerCase() === skill.name.toLowerCase());

            if (marketData) {
                totalDemand += marketData.demand;
                matchedSkills++;
            }
        });

        const averageDemand = matchedSkills > 0 ? Math.round(totalDemand / matchedSkills) : 50;

        return `${averageDemand}/100`;
    },

    /**
     * Calculate salary potential based on skills and experience
     * @param {Array} userSkills - User skills
     * @param {Object} profile - User profile
     * @returns {number} Salary potential
     */
    _calculateSalaryPotential: function (userSkills, profile) {
        // Base salary
        let baseSalary = 70000;

        // Adjust based on experience
        const experience = profile.experience || 0;
        if (experience < 2) {
            baseSalary = 65000;
        } else if (experience < 5) {
            baseSalary = 85000;
        } else if (experience < 8) {
            baseSalary = 105000;
        } else {
            baseSalary = 125000;
        }

        // Adjust based on in-demand skills
        const inDemandSkills = ['React', 'TypeScript', 'AWS', 'Python', 'DevOps', 'Cloud', 'Docker'];
        let skillBonus = 0;

        userSkills.forEach(skill => {
            if (inDemandSkills.some(s => skill.name.toLowerCase().includes(s.toLowerCase()))) {
                // Add bonus based on skill level
                const levelIndex = Utils.getSkillLevelIndex(skill.level);
                skillBonus += 2500 * levelIndex;
            }
        });

        // Cap the skill bonus
        skillBonus = Math.min(skillBonus, 20000);

        return Math.round((baseSalary + skillBonus) / 5000) * 5000; // Round to nearest $5k
    },

    /**
     * Get skill gap insight
     * @param {Array} userSkills - User skills
     * @param {Array} marketDemand - Market demand data
     * @returns {string} Skill gap insight message
     */
    _getSkillGapInsight: function (userSkills, marketDemand) {
        if (!userSkills || userSkills.length === 0) {
            return 'Complete your profile to see skill gap insights.';
        }

        const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
        const missingInDemandSkills = [];

        marketDemand.forEach(skill => {
            if (skill.demand > 80 && !userSkillNames.includes(skill.name.toLowerCase())) {
                missingInDemandSkills.push(skill.name);
            }
        });

        if (missingInDemandSkills.length > 0) {
            return `Adding ${missingInDemandSkills.slice(0, 2).join(' and ')} to your skill set could increase your job matches by up to 20%.`;
        } else {
            return 'Your skill set is well-aligned with current market demand. Consider increasing your proficiency in your existing skills.';
        }
    },

    /**
     * Get market trend insight
     * @param {Array} marketDemand - Market demand data
     * @returns {string} Market trend insight message
     */
    _getMarketTrendInsight: function (marketDemand) {
        if (!marketDemand || marketDemand.length === 0) {
            return 'Complete your profile to see market trend insights.';
        }

        // Find fastest growing skills
        const growingSkills = [...marketDemand].sort((a, b) => b.growth - a.growth).slice(0, 2);

        return `The demand for ${growingSkills[0].name} and ${growingSkills[1].name} is growing rapidly, with ${growingSkills[0].growth}% and ${growingSkills[1].growth}% increases expected this year.`;
    }
};/**
* Enhancement to the API module for TechCareerMatch
* Adds role-based job matching functionality
* 
* To use this: Add this code to your api.js file, or include it as a separate script after api.js
*/

// Check if API object exists
if (typeof API === 'undefined') {
    console.error('API module not found. Make sure api.js is loaded before this script.');
} else {
    // Extend the API object with new methods for role-based job matching

    /**
     * Get job matches for a specific role category
     * @param {string} role - Role category (e.g., "Frontend Developer")
     * @returns {Promise<Array>} Matching jobs
     */
    API.getJobMatchesByCategory = async function (role) {
        try {
            await this._delay(500);

            // Map role names to ID prefixes
            const roleToPrefix = {
                'Frontend Developer': 'job_fe_',
                'Backend Developer': 'job_be_',
                'UI/UX Designer': 'job_ux_',
                'Full Stack Developer': 'job_fs_',
                'DevOps Engineer': 'job_do_',
                'Data Scientist': 'job_ds_',
                'Mobile App Developer': 'job_ma_'
            };

            // Get the prefix for this role
            let prefix = null;
            for (const [key, value] of Object.entries(roleToPrefix)) {
                if (role.includes(key)) {
                    prefix = value;
                    break;
                }
            }

            // Get all jobs
            const allJobs = typeof DataManager !== 'undefined' ?
                DataManager.getSampleJobs() : [];

            // Filter jobs by prefix if we have one
            let jobs = allJobs;
            if (prefix) {
                jobs = allJobs.filter(job => job.id.startsWith(prefix));
                console.log(`Found ${jobs.length} jobs with prefix ${prefix} for role: ${role}`);
            } else {
                // Fallback to text search if no category match
                jobs = allJobs.filter(job =>
                    job.title.toLowerCase().includes(role.toLowerCase())
                );
                console.log(`Found ${jobs.length} jobs containing "${role}" in title`);
            }

            // Sort by match score (highest first)
            jobs.sort((a, b) => (b.calculatedMatchScore || b.matchScore) - (a.calculatedMatchScore || a.matchScore));

            return jobs;
        } catch (error) {
            console.error('Error fetching role-specific job matches:', error);
            return [];
        }
    };

    /**
     * Get related keywords for a role
     * @param {string} role - Role name
     * @returns {Array} Related keywords
     */
    API._getRelatedKeywords = function (role) {
        const roleLower = role.toLowerCase();

        // Map of related terms for common roles
        const relatedTermsMap = {
            'frontend': ['ui', 'react', 'angular', 'javascript', 'web'],
            'backend': ['api', 'server', 'node', 'python', 'java', 'database'],
            'fullstack': ['full stack', 'full-stack', 'frontend', 'backend'],
            'ui/ux': ['designer', 'design', 'user experience', 'interface'],
            'devops': ['infrastructure', 'cloud', 'aws', 'ci/cd', 'kubernetes'],
            'data scientist': ['machine learning', 'ai', 'analytics', 'statistics', 'python'],
            'mobile': ['ios', 'android', 'react native', 'swift', 'kotlin', 'app']
        };

        // Find matching keywords
        for (const [key, terms] of Object.entries(relatedTermsMap)) {
            if (roleLower.includes(key)) {
                return terms;
            }
        }

        return [roleLower]; // Default to the role itself if no matches
    };

    /**
     * Update job matches based on selected role
     * @param {string} role - The selected role
     */
    API.updateJobMatchesForRole = async function (role) {
        try {
            if (!role) return;

            // Get jobs for this role
            const roleJobs = await this.getJobMatchesByCategory(role);

            // Take top 4 jobs for dashboard
            const topJobs = roleJobs.slice(0, 4);

            // Update the top jobs in the dashboard if UI module exists
            if (typeof UI !== 'undefined' && typeof UI.renderTopJobs === 'function') {
                UI.renderTopJobs(topJobs);
                console.log(`Updated job matches for selected role: ${role}`);
            } else {
                // Fallback to manual DOM manipulation
                this._renderJobsWithoutUI(topJobs);
            }

            return topJobs;
        } catch (error) {
            console.error('Error updating job matches for role:', error);
            return [];
        }
    };

    /**
     * Render jobs without UI module (fallback)
     * @param {Array} jobs - Jobs to render
     * @private
     */
    API._renderJobsWithoutUI = function (jobs) {
        const topJobsContainer = document.getElementById('top-jobs-container');
        if (!topJobsContainer) return;

        // Clear previous jobs
        topJobsContainer.innerHTML = '';

        if (jobs.length === 0) {
            topJobsContainer.innerHTML = `
       <p class="empty-message">No job matches found. Try updating your skills or selecting a different role.</p>
     `;
            return;
        }

        // Render each job card
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.setAttribute('data-id', job.id);

            jobCard.innerHTML = `
       <div class="job-header">
         <div class="company-logo">${job.companyLogo || job.company.charAt(0)}</div>
         <div class="job-company">
           <h4>${job.company}</h4>
           <span>${job.location}</span>
         </div>
         <div class="job-match">${job.matchScore}% Match</div>
       </div>
       <h3 class="job-title">${job.title}</h3>
       <div class="job-details">
         <div class="job-detail">
           <i class="fas fa-money-bill-wave"></i> ${job.salary || 'Not specified'}
         </div>
         <div class="job-detail">
           <i class="fas fa-briefcase"></i> ${job.jobType || 'Full-time'}
         </div>
         <div class="job-detail">
           <i class="fas fa-clock"></i> ${job.experience || 'Not specified'}
         </div>
       </div>
       <div class="job-skills">
         ${job.skills.slice(0, 3).map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
         ${job.skills.length > 3 ? `<div class="skill-tag">+${job.skills.length - 3} more</div>` : ''}
       </div>
     `;

            topJobsContainer.appendChild(jobCard);
        });
    };

    console.log('API module enhanced with role-based job matching functionality');
}

// Add event listeners to support role selection in profile form
document.addEventListener('DOMContentLoaded', function () {
    // Find the role selector in the profile form
    const roleSelector = document.getElementById('user-role');

    if (roleSelector) {
        // Add change event to preview job matches
        roleSelector.addEventListener('change', function () {
            const selectedRole = this.value;
            if (selectedRole && typeof API !== 'undefined' && typeof API.getJobMatchesByCategory === 'function') {
                // Show notification about preview
                if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
                    Utils.showNotification(
                        'Preview',
                        `Showing job matches for ${selectedRole}. Save your profile to update your dashboard.`,
                        'info',
                        3000
                    );
                }

                // Preview job matches
                setTimeout(async function () {
                    try {
                        await API.updateJobMatchesForRole(selectedRole);
                    } catch (err) {
                        console.error('Error previewing role matches:', err);
                    }
                }, 500);
            }
        });

        console.log('Role selector events set up successfully');
    }

    // Hook into profile form submission to update job matches
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            // Role input might be available after the form is submitted
            setTimeout(function () {
                const roleInput = document.getElementById('user-role');
                if (roleInput && roleInput.value && typeof API !== 'undefined' && typeof API.updateJobMatchesForRole === 'function') {
                    API.updateJobMatchesForRole(roleInput.value);
                }
            }, 1000); // Delay to allow profile to be saved first
        });
    }
});