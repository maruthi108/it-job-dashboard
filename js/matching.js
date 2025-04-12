/**
 * Job matching and skill analysis functionality for TechCareerMatch
 */

const MatchingEngine = {
    /**
     * Initialize the matching engine
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function() {
        try {
            console.log('MatchingEngine initialized');
            return true;
        } catch (error) {
            console.error('Error initializing MatchingEngine:', error);
            return false;
        }
    },
    
    /**
     * Get top job matches for the dashboard
     * @param {number} limit - Number of jobs to return
     * @returns {Promise<Array>} Top job matches
     */
    getTopMatches: async function(limit = 3) {
        try {
            const jobs = await API.getJobMatches();
            return jobs.slice(0, limit);
        } catch (error) {
            console.error('Error getting top matches:', error);
            return [];
        }
    },
    
    /**
     * Get all job matches with pagination
     * @param {Object} filters - Filter options
     * @param {number} page - Page number
     * @param {number} pageSize - Page size
     * @returns {Promise<Object>} Paginated job matches
     */
    getAllMatches: async function(filters = {}, page = 1, pageSize = CONFIG.pagination.jobsPerPage) {
        try {
            const allJobs = await API.getJobMatches(filters);
            
            // Calculate pagination
            const totalJobs = allJobs.length;
            const totalPages = Math.ceil(totalJobs / pageSize);
            const currentPage = Math.min(Math.max(1, page), totalPages || 1);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            
            // Get jobs for current page
            const jobs = allJobs.slice(startIndex, endIndex);
            
            return {
                jobs,
                pagination: {
                    currentPage,
                    totalPages,
                    totalJobs,
                    hasPrev: currentPage > 1,
                    hasNext: currentPage < totalPages
                }
            };
        } catch (error) {
            console.error('Error getting all matches:', error);
            return {
                jobs: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalJobs: 0,
                    hasPrev: false,
                    hasNext: false
                }
            };
        }
    },
    
    /**
     * Get job details
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Job details
     */
    getJobDetails: async function(jobId) {
        try {
            const jobs = await API.getJobMatches();
            const job = jobs.find(job => job.id === jobId);
            
            if (!job) {
                throw new Error('Job not found');
            }
            
            // Get user skills for matching
            const userSkills = await DataManager.getUserSkills();
            const userSkillMap = {};
            
            userSkills.forEach(skill => {
                userSkillMap[skill.name.toLowerCase()] = Utils.getSkillLevelIndex(skill.level) * 25;
            });
            
            // Calculate skill matches
            const skillMatches = job.skills.map(skill => {
                const userLevel = userSkillMap[skill.toLowerCase()] || 0;
                return {
                    name: skill,
                    percentage: userLevel
                };
            });
            
            return {
                ...job,
                skillMatches
            };
        } catch (error) {
            console.error('Error getting job details:', error);
            return null;
        }
    },
    
    /**
     * Check if a job is saved
     * @param {string} jobId - Job ID
     * @returns {Promise<boolean>} Whether the job is saved
     */
    isJobSaved: async function(jobId) {
        try {
            const savedJobs = await DataManager.getSavedJobs();
            return savedJobs.some(job => job.id === jobId);
        } catch (error) {
            console.error('Error checking saved job:', error);
            return false;
        }
    },
    
    /**
     * Toggle job saved status
     * @param {string} jobId - Job ID
     * @returns {Promise<boolean>} New saved status
     */
    toggleJobSaved: async function(jobId) {
        try {
            const isSaved = await this.isJobSaved(jobId);
            
            if (isSaved) {
                // Remove from saved jobs
                await DataManager.removeSavedJob(jobId);
                return false;
            } else {
                // Add to saved jobs
                const jobs = await API.getJobMatches();
                const job = jobs.find(job => job.id === jobId);
                
                if (job) {
                    await DataManager.saveJob(job);
                    return true;
                }
                
                return false;
            }
        } catch (error) {
            console.error('Error toggling saved job:', error);
            return false;
        }
    },
    
    /**
     * Get user's skills with market insights
     * @returns {Promise<Array>} User skills with insights
     */
    getUserSkillsWithInsights: async function() {
        try {
            const skillAnalysis = await API.getSkillAnalysis();
            return skillAnalysis.userSkills;
        } catch (error) {
            console.error('Error getting user skills with insights:', error);
            return [];
        }
    },
    
    /**
     * Get skill gaps for target role
     * @returns {Promise<Array>} Skill gaps
     */
    getSkillGaps: async function() {
        try {
            const skillAnalysis = await API.getSkillAnalysis();
            return skillAnalysis.skillGaps;
        } catch (error) {
            console.error('Error getting skill gaps:', error);
            return [];
        }
    },
    
    /**
     * Get target role required skills
     * @returns {Promise<Array>} Target role skills
     */
    getTargetRoleSkills: async function() {
        try {
            const skillAnalysis = await API.getSkillAnalysis();
            return skillAnalysis.targetRoleSkills;
        } catch (error) {
            console.error('Error getting target role skills:', error);
            return [];
        }
    },
    
    /**
     * Generate recommendations based on profile and skills
     * @returns {Promise<Object>} Personalized recommendations
     */
    generateRecommendations: async function() {
        try {
            // Get user data
            const profile = await DataManager.getUserProfile();
            const userSkills = await DataManager.getUserSkills();
            
            // Get skill analysis
            const skillAnalysis = await API.getSkillAnalysis();
            
            // Get learning paths
            const learningPaths = await API.getLearningPaths();
            
            // Generate skill recommendations
            const skillRecommendations = this._generateSkillRecommendations(
                userSkills,
                skillAnalysis.skillGaps,
                skillAnalysis.targetRoleSkills
            );
            
            // Generate career path recommendations
            const careerPathRecommendations = this._generateCareerPathRecommendations(
                profile,
                userSkills
            );
            
            // Generate learning recommendations
            const learningRecommendations = this._generateLearningRecommendations(
                learningPaths,
                userSkills
            );
            
            return {
                skillRecommendations,
                careerPathRecommendations,
                learningRecommendations
            };
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return {
                skillRecommendations: [],
                careerPathRecommendations: [],
                learningRecommendations: []
            };
        }
    },
    
    /**
     * Generate skill recommendations
     * @param {Array} userSkills - User skills
     * @param {Array} skillGaps - Skill gaps
     * @param {Array} targetSkills - Target role skills
     * @returns {Array} Skill recommendations
     */
    _generateSkillRecommendations: function(userSkills, skillGaps, targetSkills) {
        // Identify skills to improve
        const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
        const skillsToImprove = [];
        const skillsToLearn = [];
        
        // Check existing skills that need improvement
        userSkills.forEach(skill => {
            const targetSkill = targetSkills.find(
                ts => ts.name.toLowerCase() === skill.name.toLowerCase()
            );
            
            if (targetSkill) {
                const userLevelIndex = Utils.getSkillLevelIndex(skill.level);
                const targetLevelIndex = Utils.getSkillLevelIndex(targetSkill.level);
                
                if (userLevelIndex < targetLevelIndex) {
                    skillsToImprove.push({
                        name: skill.name,
                        currentLevel: skill.level,
                        targetLevel: targetSkill.level,
                        importance: targetSkill.importance
                    });
                }
            }
        });
        
        // Identify new skills to learn
        targetSkills.forEach(skill => {
            if (!userSkillNames.includes(skill.name.toLowerCase())) {
                skillsToLearn.push({
                    name: skill.name,
                    level: skill.level,
                    importance: skill.importance
                });
            }
        });
        
        // Sort by importance
        const importancePriority = {
            'Critical': 3,
            'Important': 2,
            'Useful': 1
        };
        
        skillsToImprove.sort((a, b) => 
            importancePriority[b.importance] - importancePriority[a.importance]
        );
        
        skillsToLearn.sort((a, b) => 
            importancePriority[b.importance] - importancePriority[a.importance]
        );
        
        return {
            skillsToImprove,
            skillsToLearn
        };
    },
    
    /**
     * Generate career path recommendations
     * @param {Object} profile - User profile
     * @param {Array} userSkills - User skills
     * @returns {Object} Career path recommendations
     */
    _generateCareerPathRecommendations: function(profile, userSkills) {
        // Get user's experience level
        const experience = profile.experience || 0;
        
        // Determine career stage and next steps
        let careerStage;
        let nextRoles = [];
        let timeframe;
        
        if (experience < 2) {
            careerStage = 'Early Career';
            nextRoles = ['Mid-level Developer', 'Specialized Developer (Frontend/Backend)'];
            timeframe = '1-2 years';
        } else if (experience < 5) {
            careerStage = 'Mid Career';
            nextRoles = ['Senior Developer', 'Team Lead', 'Specialized Expert'];
            timeframe = '2-3 years';
        } else if (experience < 8) {
            careerStage = 'Senior Level';
            nextRoles = ['Lead Developer', 'Technical Architect', 'Engineering Manager'];
            timeframe = '2-4 years';
        } else {
            careerStage = 'Expert Level';
            nextRoles = ['Technical Director', 'CTO', 'VP of Engineering'];
            timeframe = '3-5 years';
        }
        
        return {
            currentStage: careerStage,
            nextRoles,
            timeframe,
            requiredExperience: Math.max(0, 5 - experience) + ' more years'
        };
    },
    
    /**
     * Generate learning recommendations
     * @param {Array} learningPaths - Available learning paths
     * @param {Array} userSkills - User skills
     * @returns {Array} Recommended learning paths
     */
    _generateLearningRecommendations: function(learningPaths, userSkills) {
        // Filter to most relevant paths
        return learningPaths
            .filter(path => path.calculatedRelevance > 70)
            .slice(0, 3)
            .map(path => ({
                id: path.id,
                title: path.title,
                description: path.description,
                relevance: path.calculatedRelevance,
                duration: path.duration,
                difficulty: path.difficulty
            }));
    }
};