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
    init: async function() {
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
    _delay: function(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * Get job matches based on user profile
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>} Job matches
     */
    getJobMatches: async function(filters = {}) {
        try {
            await this._delay(800);
            
            // Get user profile and skills
            const profile = await DataManager.getUserProfile();
            const userSkills = await DataManager.getUserSkills();
            const userSkillNames = userSkills.map(skill => skill.name);
            
            // Get sample job data
            let jobs = DataManager.getSampleJobs();
            
            // Calculate match scores if not already calculated
            jobs = jobs.map(job => {
                if (!job.calculatedMatchScore) {
                    const skillMatch = Utils.calculateArrayMatch(job.skills, userSkillNames);
                    
                    // Additional factors for match score
                    let experienceMatch = 100;
                    let locationMatch = 100;
                    
                    // Experience matching
                    const userExperience = profile.experience || 0;
                    if (job.experience) {
                        const expRange = job.experience.match(/(\d+)-(\d+)/);
                        if (expRange) {
                            const minExp = parseInt(expRange[1]);
                            const maxExp = parseInt(expRange[2]);
                            
                            if (userExperience < minExp) {
                                // Too little experience
                                experienceMatch = Math.min(85, 100 - (minExp - userExperience) * 15);
                            } else if (userExperience > maxExp + 2) {
                                // Too much experience
                                experienceMatch = Math.min(90, 100 - (userExperience - maxExp) * 5);
                            }
                        }
                    }
                    
                    // Location matching
                    const userLocationPref = profile.locationPreference || '';
                    if (userLocationPref && job.location) {
                        if (userLocationPref === 'Remote' && !job.location.includes('Remote')) {
                            locationMatch = 70;
                        } else if (userLocationPref === 'On-site' && job.location.includes('Remote')) {
                            locationMatch = 70;
                        }
                    }
                    
                    // Calculate final match score (weighted average)
                    const finalMatchScore = Math.round(
                        (skillMatch * 0.6) + 
                        (experienceMatch * 0.25) + 
                        (locationMatch * 0.15)
                    );
                    
                    return {
                        ...job,
                        calculatedMatchScore: finalMatchScore
                    };
                }
                
                return job;
            });
            
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
    
    /**
     * Get skill analysis data
     * @returns {Promise<Object>} Skill analysis data
     */
    getSkillAnalysis: async function() {
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
    _calculateSkillValue: function(skill, marketData) {
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
    _getTargetRoleSkills: function() {
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
    getLearningPaths: async function() {
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
    _calculateLearningPathRelevance: function(path, userSkills) {
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
    getCareerRoadmap: async function() {
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
    getDashboardData: async function() {
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
    _calculateAverageMarketDemand: function(userSkills, marketDemand) {
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
    _calculateSalaryPotential: function(userSkills, profile) {
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
    _getSkillGapInsight: function(userSkills, marketDemand) {
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
    _getMarketTrendInsight: function(marketDemand) {
        if (!marketDemand || marketDemand.length === 0) {
            return 'Complete your profile to see market trend insights.';
        }
        
        // Find fastest growing skills
        const growingSkills = [...marketDemand].sort((a, b) => b.growth - a.growth).slice(0, 2);
        
        return `The demand for ${growingSkills[0].name} and ${growingSkills[1].name} is growing rapidly, with ${growingSkills[0].growth}% and ${growingSkills[1].growth}% increases expected this year.`;
    }
};