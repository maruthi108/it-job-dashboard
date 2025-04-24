/**
 * ResumeProcessor for TechCareerMatch
 * Handles resume file processing and data extraction
 */

const ResumeProcessor = {
    /**
     * Initialize the resume processor
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function () {
        try {
            console.log('ResumeProcessor initialized');

            // Set up event listeners for resume uploads
            this._setupEventListeners();

            // Check for existing resume and update UI
            await this._checkForExistingResume();

            return true;
        } catch (error) {
            console.error('Error initializing ResumeProcessor:', error);
            return false;
        }
    },

    /**
     * Set up event listeners for resume uploads
     * @private
     */
    _setupEventListeners: function () {
        const uploadBtn = document.getElementById('upload-resume-btn');
        const uploadInput = document.getElementById('resume-upload-input');

        if (uploadBtn && uploadInput) {
            // Trigger file input when button is clicked
            uploadBtn.addEventListener('click', () => {
                uploadInput.click();
            });

            // Handle file selection
            uploadInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    this.handleResumeUpload(e.target.files[0]);
                }
            });
        }

        // Handle drag and drop on welcome banner
        const welcomeBanner = document.querySelector('.welcome-banner');
        if (welcomeBanner) {
            welcomeBanner.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                welcomeBanner.classList.add('drag-over');
            });

            welcomeBanner.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                welcomeBanner.classList.remove('drag-over');
            });

            welcomeBanner.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                welcomeBanner.classList.remove('drag-over');

                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    if (this._isValidResumeFile(file)) {
                        this.handleResumeUpload(file);
                    } else {
                        Utils.showNotification(
                            'Invalid File',
                            'Please upload a resume file in PDF, DOC, or DOCX format.',
                            'error'
                        );
                    }
                }
            });
        }
    },

    /**
     * Check if a file is a valid resume format
     * @param {File} file - The file to check
     * @returns {boolean} Whether the file is valid
     * @private
     */
    _isValidResumeFile: function (file) {
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        return validTypes.includes(file.type);
    },

    /**
     * Check for existing resume and update UI
     * @private
     */
    _checkForExistingResume: async function () {
        try {
            const resumeMetadata = await StorageManager.getResumeMetadata();

            if (resumeMetadata) {
                this._updateResumeStatusUI(resumeMetadata);
            }
        } catch (error) {
            console.error('Error checking for existing resume:', error);
        }
    },

    /**
     * Handle resume file upload
     * @param {File} file - The resume file
     */
    handleResumeUpload: async function (file) {
        try {
            if (!this._isValidResumeFile(file)) {
                Utils.showNotification(
                    'Invalid File',
                    'Please upload a resume file in PDF, DOC, or DOCX format.',
                    'error'
                );
                return;
            }

            // Show loading notification
            Utils.showNotification(
                'Processing',
                'Uploading and processing your resume...',
                'info',
                3000
            );

            // Process the resume file
            const result = await StorageManager.processResumeUpload(file);

            // Update UI with file info
            this._updateResumeStatusUI(result.metadata);

            // Pre-fill profile form if data was extracted
            if (result.extractedData) {
                await this._preFillProfileWithExtractedData(result.extractedData);
            }

            Utils.showNotification(
                'Resume Ready',
                'Your resume has been uploaded and processed successfully.',
                'success'
            );
        } catch (error) {
            console.error('Error handling resume upload:', error);

            Utils.showNotification(
                'Upload Failed',
                'There was an error processing your resume. Please try again.',
                'error'
            );
        }
    },

    /**
     * Update UI to show resume status
     * @param {Object} metadata - Resume metadata
     * @private
     */
    _updateResumeStatusUI: function (metadata) {
        const resumeStatus = document.getElementById('resume-status');

        if (!resumeStatus) return;

        // Format file size
        const fileSize = this._formatFileSize(metadata.fileSize);

        // Create resume file info element
        resumeStatus.innerHTML = `
          <div class="resume-file">
              <i class="fas fa-file-alt"></i>
              <span class="resume-filename">${metadata.fileName}</span>
              <span class="resume-filesize">(${fileSize})</span>
              <button class="resume-remove" id="remove-resume-btn">
                  <i class="fas fa-times"></i>
              </button>
          </div>
      `;

        // Add event listener to remove button
        const removeBtn = document.getElementById('remove-resume-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeResume(metadata.id);
            });
        }
    },

    /**
     * Format file size to human-readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     * @private
     */
    _formatFileSize: function (bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    },

    /**
     * Remove a resume file
     * @param {string} resumeId - Resume ID
     */
    removeResume: async function (resumeId) {
        try {
            const success = await StorageManager.deleteResumeFile(resumeId);

            if (success) {
                // Clear the resume status UI
                const resumeStatus = document.getElementById('resume-status');
                if (resumeStatus) {
                    resumeStatus.innerHTML = '';
                }

                Utils.showNotification(
                    'Resume Removed',
                    'Your resume has been removed successfully.',
                    'success'
                );
            } else {
                Utils.showNotification(
                    'Error',
                    'Failed to remove resume. Please try again.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error removing resume:', error);

            Utils.showNotification(
                'Error',
                'Failed to remove resume. Please try again.',
                'error'
            );
        }
    },

    /**
     * Pre-fill profile form with extracted data
     * @param {Object} extractedData - Data extracted from resume
     * @private
     */
    _preFillProfileWithExtractedData: async function (extractedData) {
        try {
            // Get current profile data
            const currentProfile = await StorageManager.getProfileData();

            // Prepare merged data (only fill empty fields)
            const mergedData = {
                name: currentProfile.name || extractedData.name || '',
                email: currentProfile.email || extractedData.email || '',
                skills: currentProfile.skills || extractedData.skills || [],
                education: currentProfile.education || extractedData.education || ''
            };

            // Update profile with extracted data
            if (Object.keys(mergedData).some(key => mergedData[key] !== '')) {
                await StorageManager.saveProfileData(mergedData);

                // Update UI fields if profile form is open
                this._updateProfileFormFields(mergedData);

                console.log('Profile pre-filled with resume data');
            }
        } catch (error) {
            console.error('Error pre-filling profile with resume data:', error);
        }
    },

    /**
     * Update profile form fields with data
     * @param {Object} data - Profile data
     * @private
     */
    _updateProfileFormFields: function (data) {
        // Update name field
        const nameInput = document.getElementById('user-name-input');
        if (nameInput && data.name && !nameInput.value) {
            nameInput.value = data.name;
        }

        // Update email field
        const emailInput = document.getElementById('user-email');
        if (emailInput && data.email && !emailInput.value) {
            emailInput.value = data.email;
        }

        // Update skills field
        const skillsInput = document.getElementById('user-skills');
        if (skillsInput && data.skills && data.skills.length > 0 && !skillsInput.value) {
            skillsInput.value = data.skills.join(', ');
        }

        // Update education field
        const educationSelect = document.getElementById('user-education');
        if (educationSelect && data.education && !educationSelect.value) {
            // Find the closest matching education option
            const options = Array.from(educationSelect.options);
            const matchingOption = options.find(option =>
                option.value.toLowerCase().includes(data.education.toLowerCase()) ||
                data.education.toLowerCase().includes(option.value.toLowerCase())
            );

            if (matchingOption) {
                educationSelect.value = matchingOption.value;
            }
        }
    },

    /**
     * Extract skills from text content
     * @param {string} text - Text content
     * @returns {Array} Extracted skills
     */
    extractSkillsFromText: function (text) {
        // Common tech skills to look for
        const commonSkills = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Go', 'Swift',
            'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET',
            'HTML', 'CSS', 'SCSS', 'Sass', 'Bootstrap', 'Tailwind', 'Material UI', 'jQuery',
            'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Oracle', 'Redis', 'Firebase',
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CircleCI', 'GitLab CI',
            'Git', 'GitHub', 'BitBucket', 'SVN', 'Mercurial',
            'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Trello',
            'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'R',
            'Mobile', 'iOS', 'Android', 'React Native', 'Flutter'
        ];

        const extractedSkills = [];

        // Find matches for common skills
        commonSkills.forEach(skill => {
            const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
            if (regex.test(text)) {
                extractedSkills.push(skill);
            }
        });

        return extractedSkills;
    },
    /**
 * Extract text from a resume file
 * @param {File} file - The resume file
 * @returns {Promise<string>} Extracted text
 */
    extractTextFromResume: async function (file) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();

                reader.onload = async function (e) {
                    const fileData = e.target.result;
                    let text = '';

                    // Handle different file types
                    if (file.type === 'application/pdf') {
                        // If using pdf.js (requires additional setup)
                        // const pdf = await pdfjsLib.getDocument({data: fileData}).promise;
                        // text = await extractPdfText(pdf);

                        // For now, return placeholder message
                        text = "PDF text extraction would happen here";
                    } else if (file.type.includes('word')) {
                        // If using mammoth.js (requires additional setup)
                        // const result = await mammoth.extractRawText({arrayBuffer: fileData});
                        // text = result.value;

                        // For now, return placeholder message
                        text = "Word document text extraction would happen here";
                    } else {
                        text = "Unsupported file format for text extraction";
                    }

                    resolve(text);
                };

                reader.onerror = function () {
                    reject(new Error('Error reading file'));
                };

                if (file.type === 'application/pdf' || file.type.includes('word')) {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
};