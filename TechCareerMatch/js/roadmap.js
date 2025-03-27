/**
 * Career roadmap functionality for TechCareerMatch
 */

const RoadmapManager = {
    /**
     * Initialize roadmap manager
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function() {
        try {
            console.log('RoadmapManager initialized');
            return true;
        } catch (error) {
            console.error('Error initializing RoadmapManager:', error);
            return false;
        }
    },
    
    /**
     * Get career path steps
     * @returns {Promise<Array>} Career path steps
     */
    getCareerPath: async function() {
        try {
            const roadmapData = await API.getCareerRoadmap();
            return roadmapData.careerPath;
        } catch (error) {
            console.error('Error getting career path:', error);
            return [];
        }
    },
    
    /**
     * Get skill development timeline
     * @param {number} months - Number of months to include
     * @returns {Promise<Array>} Timeline items
     */
    getTimeline: async function(months = 12) {
        try {
            const roadmapData = await API.getCareerRoadmap();
            let timeline = roadmapData.timeline;
            
            // Filter timeline based on months
            if (months < 18) {
                timeline = timeline.slice(0, 3);
            }
            
            return timeline;
        } catch (error) {
            console.error('Error getting timeline:', error);
            return [];
        }
    },
    
    /**
     * Get experience to salary relationship data
     * @returns {Promise<Array>} Experience-salary data
     */
    getExperienceSalaryData: async function() {
        try {
            const roadmapData = await API.getCareerRoadmap();
            return roadmapData.experienceSalary;
        } catch (error) {
            console.error('Error getting experience-salary data:', error);
            return [];
        }
    },
    
    /**
     * Generate a personalized roadmap based on user profile
     * @returns {Promise<Object>} Personalized roadmap
     */
    generatePersonalizedRoadmap: async function() {
        try {
            // Get user profile and skills
            const profile = await DataManager.getUserProfile();
            const userSkills = await DataManager.getUserSkills();
            const preferences = await DataManager.getUserPreferences();
            
            // Get standard roadmap data
            const standardRoadmap = await API.getCareerRoadmap();
            
            // Determine current position in career path
            const experience = profile.experience || 0;
            const careerPath = this._customizeCareerPath(standardRoadmap.careerPath, experience, preferences.targetRole);
            
            // Generate skill timeline
            const skillTimeline = this._generateSkillTimeline(userSkills, standardRoadmap.timeline);
            
            // Customize experience-salary chart
            const experienceSalary = this._customizeExperienceSalaryChart(
                standardRoadmap.experienceSalary, 
                experience, 
                profile.currentSalary || 0,
                preferences.targetRole
            );
            
            return {
                careerPath,
                timeline: skillTimeline,
                experienceSalary
            };
        } catch (error) {
            console.error('Error generating personalized roadmap:', error);
            return {
                careerPath: [],
                timeline: [],
                experienceSalary: []
            };
        }
    },
    
    /**
     * Customize career path based on user experience and target role
     * @param {Array} standardPath - Standard career path
     * @param {number} experience - User experience in years
     * @param {string} targetRole - User's target role
     * @returns {Array} Customized career path
     */
    _customizeCareerPath: function(standardPath, experience, targetRole) {
        // Create a copy of the standard path
        const customPath = JSON.parse(JSON.stringify(standardPath));
        
        // Determine current step based on experience
        let currentStepIndex = 0;
        
        if (experience < 3) {
            currentStepIndex = 0;
        } else if (experience < 5) {
            currentStepIndex = 1;
        } else if (experience < 8) {
            currentStepIndex = 2;
        } else {
            currentStepIndex = 3;
        }
        
        // Update current flag for all steps
        customPath.forEach((step, index) => {
            step.current = (index === currentStepIndex);
        });
        
        // Customize based on target role if provided
        if (targetRole) {
            // Check if target role is already in the path
            const targetRoleInPath = customPath.some(step => 
                step.title.toLowerCase().includes(targetRole.toLowerCase())
            );
            
            if (!targetRoleInPath) {
                // Add target role as an alternative path
                const targetStep = currentStepIndex + 1;
                
                if (targetStep < customPath.length) {
                    customPath[targetStep].alternativeTitle = targetRole;
                    customPath[targetStep].alternativeDescription = `Alternative path: ${targetRole}`;
                }
            }
        }
        
        return customPath;
    },
    
    /**
     * Generate skill timeline based on user skills
     * @param {Array} userSkills - User skills
     * @param {Array} standardTimeline - Standard timeline
     * @returns {Array} Customized skill timeline
     */
    _generateSkillTimeline: function(userSkills, standardTimeline) {
        // Create a copy of the standard timeline
        const customTimeline = JSON.parse(JSON.stringify(standardTimeline));
        
        // Get user skill names
        const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
        
        // Customize each timeline item
        customTimeline.forEach(item => {
            // Check if user already has some of the skills
            const existingSkills = item.skills.filter(skill => 
                userSkillNames.includes(skill.toLowerCase())
            );
            
            const newSkills = item.skills.filter(skill => 
                !userSkillNames.includes(skill.toLowerCase())
            );
            
            // Add existing skills info
            if (existingSkills.length > 0) {
                item.existingSkills = existingSkills;
            }
            
            // Update skills to only show new ones
            item.skills = newSkills;
            
            // Adjust description if needed
            if (existingSkills.length > 0) {
                const existingSkillsText = existingSkills.length === 1 
                    ? existingSkills[0] 
                    : `${existingSkills.slice(0, -1).join(', ')} and ${existingSkills[existingSkills.length - 1]}`;
                
                item.description += ` You already have experience with ${existingSkillsText}.`;
            }
        });
        
        return customTimeline;
    },
    
    /**
     * Customize experience-salary chart
     * @param {Array} standardData - Standard experience-salary data
     * @param {number} experience - User experience in years
     * @param {number} currentSalary - User's current salary
     * @param {string} targetRole - User's target role
     * @returns {Array} Customized experience-salary data
     */
    _customizeExperienceSalaryChart: function(standardData, experience, currentSalary, targetRole) {
        // Create a copy of the standard data
        const customData = JSON.parse(JSON.stringify(standardData));
        
        // If user has current salary info, adjust the chart
        if (currentSalary > 0) {
            // Find the closest experience point
            const closestPoint = customData.find(point => Math.abs(point.years - experience) < 1);
            
            if (closestPoint) {
                // Calculate the difference between standard and actual salary
                const salaryDiff = currentSalary - closestPoint.salary;
                const diffPercentage = salaryDiff / closestPoint.salary;
                
                // Apply the differential to all future points
                customData.forEach(point => {
                    if (point.years >= experience) {
                        // Adjust salary based on the differential
                        // More significant adjustments for closer points, diminishing for further points
                        const adjustmentFactor = 1 - (Math.max(0, point.years - experience) / 10);
                        point.salary = Math.round(point.salary * (1 + (diffPercentage * adjustmentFactor)));
                    }
                });
            }
        }
        
        // Add current position marker
        customData.currentExperience = experience;
        customData.currentSalary = currentSalary || this._estimateSalaryForExperience(standardData, experience);
        
        // Add target role adjustment if specified
        if (targetRole) {
            // Define salary modifiers for different roles
            const roleModifiers = {
                'frontend': 1.0,
                'backend': 1.05,
                'fullstack': 1.1,
                'devops': 1.15,
                'data': 1.2,
                'machine learning': 1.25,
                'ai': 1.3,
                'manager': 1.2,
                'director': 1.5,
                'architect': 1.3,
                'lead': 1.15
            };
            
            // Find applicable modifier
            let modifier = 1.0;
            for (const [role, mod] of Object.entries(roleModifiers)) {
                if (targetRole.toLowerCase().includes(role)) {
                    modifier = mod;
                    break;
                }
            }
            
            // Apply modifier for future points
            if (modifier !== 1.0) {
                customData.forEach(point => {
                    if (point.years > experience) {
                        point.salary = Math.round(point.salary * modifier);
                    }
                });
                
                // Add target role info
                customData.targetRole = targetRole;
                customData.targetRoleModifier = modifier;
            }
        }
        
        return customData;
    },
    
    /**
     * Estimate salary for a given experience level
     * @param {Array} data - Experience-salary data
     * @param {number} experience - Experience in years
     * @returns {number} Estimated salary
     */
    _estimateSalaryForExperience: function(data, experience) {
        // Find the two closest points
        let lowerPoint = null;
        let upperPoint = null;
        
        for (const point of data) {
            if (point.years <= experience && (!lowerPoint || point.years > lowerPoint.years)) {
                lowerPoint = point;
            }
            
            if (point.years >= experience && (!upperPoint || point.years < upperPoint.years)) {
                upperPoint = point;
            }
        }
        
        // Exact match
        if (lowerPoint && lowerPoint.years === experience) {
            return lowerPoint.salary;
        }
        
        // Interpolate between points
        if (lowerPoint && upperPoint) {
            const expRange = upperPoint.years - lowerPoint.years;
            const salaryRange = upperPoint.salary - lowerPoint.salary;
            const expRatio = (experience - lowerPoint.years) / expRange;
            
            return Math.round(lowerPoint.salary + (salaryRange * expRatio));
        }
        
        // Extrapolate beyond range
        if (lowerPoint) {
            // Beyond max experience
            const expDiff = experience - lowerPoint.years;
            const avgYearlyIncrease = 10000; // Average annual salary increase
            
            return Math.round(lowerPoint.salary + (expDiff * avgYearlyIncrease));
        }
        
        if (upperPoint) {
            // Below min experience
            const expDiff = upperPoint.years - experience;
            const avgYearlyIncrease = 10000; // Average annual salary increase
            
            return Math.round(upperPoint.salary - (expDiff * avgYearlyIncrease));
        }
        
        // Fallback
        return 70000 + (experience * 10000);
    },
    
    /**
     * Get recommended skill acquisition order
     * @returns {Promise<Array>} Ordered skill recommendations
     */
    getSkillAcquisitionOrder: async function() {
        try {
            // Get user skills
            const userSkills = await DataManager.getUserSkills();
            const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
            
            // Get skill gaps
            const skillGaps = await MatchingEngine.getSkillGaps();
            
            // Get target role skills
            const targetSkills = await MatchingEngine.getTargetRoleSkills();
            
            // Collect skills to learn (not already known)
            const skillsToLearn = [];
            
            // Add target skills that user doesn't have
            targetSkills.forEach(skill => {
                if (!userSkillNames.includes(skill.name.toLowerCase())) {
                    skillsToLearn.push({
                        name: skill.name,
                        priority: this._getPriorityScore(skill.importance),
                        importance: skill.importance,
                        source: 'target'
                    });
                }
            });
            
            // Add skill gaps that aren't already in the list
            skillGaps.forEach(skill => {
                if (!userSkillNames.includes(skill.name.toLowerCase()) && 
                    !skillsToLearn.some(s => s.name.toLowerCase() === skill.name.toLowerCase())) {
                    skillsToLearn.push({
                        name: skill.name,
                        priority: skill.gap / 10,
                        importance: skill.gap > 70 ? 'Important' : 'Useful',
                        source: 'gap'
                    });
                }
            });
            
            // Sort by priority
            skillsToLearn.sort((a, b) => b.priority - a.priority);
            
            return skillsToLearn;
        } catch (error) {
            console.error('Error getting skill acquisition order:', error);
            return [];
        }
    },
    
    /**
     * Get priority score based on importance
     * @param {string} importance - Importance level
     * @returns {number} Priority score
     */
    _getPriorityScore: function(importance) {
        switch (importance) {
            case 'Critical':
                return 10;
            case 'Important':
                return 7;
            case 'Useful':
                return 4;
            default:
                return 1;
        }
    }
};