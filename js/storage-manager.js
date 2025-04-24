/**
 * StorageManager for TechCareerMatch
 * Handles persistent client-side storage of profile data and resume files
 */

const StorageManager = {
    /**
     * Initialize the storage manager
     * @returns {Promise<boolean>} Success indicator
     */
    init: async function () {
        try {
            // Configure LocalForage for profile data
            localforage.config({
                name: CONFIG.storage.name,
                description: CONFIG.storage.description,
                version: CONFIG.version
            });

            // Initialize the resume storage database
            await this._initResumeStorage();

            console.log('StorageManager initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing StorageManager:', error);
            return false;
        }
    },

    /**
     * Initialize IndexedDB for resume storage
     * @private
     */
    _initResumeStorage: function () {
        return new Promise((resolve, reject) => {
            // Open or create the IndexedDB database for resume storage
            const request = indexedDB.open('TechCareerMatchResumes', 1);

            request.onerror = function (event) {
                console.error('Error opening resume database:', event.target.error);
                reject(event.target.error);
            };

            request.onupgradeneeded = function (event) {
                const db = event.target.result;

                // Create an object store for resumes if it doesn't exist
                if (!db.objectStoreNames.contains('resumes')) {
                    const store = db.createObjectStore('resumes', { keyPath: 'id' });
                    store.createIndex('userId', 'userId', { unique: true });
                    store.createIndex('uploadDate', 'uploadDate', { unique: false });
                }
            };

            request.onsuccess = function (event) {
                const db = event.target.result;
                db.close();
                resolve(true);
            };
        });
    },

    /**
     * Save user profile data
     * @param {Object} profileData - User profile data
     * @returns {Promise<Object>} Updated profile data
     */
    saveProfileData: async function (profileData) {
        try {
            // Get current profile if it exists
            const currentProfile = await localforage.getItem(CONFIG.storage.userProfileKey) || {};

            // Merge with new data and add last updated timestamp
            const updatedProfile = {
                ...currentProfile,
                ...profileData,
                lastUpdated: new Date().toISOString()
            };

            // Save to LocalForage
            await localforage.setItem(CONFIG.storage.userProfileKey, updatedProfile);

            // Update analytics after profile update
            if (typeof DataManager !== 'undefined' && typeof DataManager.recalculateAnalytics === 'function') {
                await DataManager.recalculateAnalytics();
            }

            return updatedProfile;
        } catch (error) {
            console.error('Error saving profile data:', error);
            throw error;
        }
    },

    /**
     * Get user profile data
     * @returns {Promise<Object>} User profile data
     */
    getProfileData: async function () {
        try {
            return await localforage.getItem(CONFIG.storage.userProfileKey) || {};
        } catch (error) {
            console.error('Error getting profile data:', error);
            return {};
        }
    },

    /**
     * Save a resume file
     * @param {File} file - The resume file to save
     * @param {string} userId - User identifier (defaults to 'current')
     * @returns {Promise<Object>} Resume metadata
     */
    saveResumeFile: async function (file, userId = 'current') {
        return new Promise((resolve, reject) => {
            // Open the database
            const request = indexedDB.open('TechCareerMatchResumes', 1);

            request.onerror = function (event) {
                console.error('Error opening resume database:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = function (event) {
                const db = event.target.result;

                // Start a transaction
                const transaction = db.transaction(['resumes'], 'readwrite');
                const store = transaction.objectStore('resumes');

                // Generate a unique ID for the resume
                const resumeId = `resume_${Date.now()}`;

                // Read the file content
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Create resume object with metadata
                    const resumeObject = {
                        id: resumeId,
                        userId: userId,
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        uploadDate: new Date().toISOString(),
                        fileData: e.target.result
                    };

                    // Add to the object store
                    const addRequest = store.put(resumeObject);

                    addRequest.onsuccess = function () {
                        // Return the metadata (without the file data)
                        const metadata = { ...resumeObject };
                        delete metadata.fileData;

                        // Save the last uploaded resume ID to LocalForage
                        localforage.setItem(CONFIG.storage.userResumeKey || 'lastResumeId', resumeId)
                            .then(() => {
                                resolve(metadata);
                            })
                            .catch(err => {
                                console.error('Error saving resume ID:', err);
                                resolve(metadata);
                            });
                    };

                    addRequest.onerror = function (event) {
                        console.error('Error saving resume:', event.target.error);
                        reject(event.target.error);
                    };
                };

                reader.onerror = function (event) {
                    console.error('Error reading file:', event.target.error);
                    reject(event.target.error);
                };

                // Read the file as an ArrayBuffer
                reader.readAsArrayBuffer(file);

                // Close the database when transaction completes
                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    },

    /**
     * Get the most recent resume metadata
     * @param {string} userId - User identifier (defaults to 'current')
     * @returns {Promise<Object>} Resume metadata (without file data)
     */
    getResumeMetadata: async function (userId = 'current') {
        try {
            // Try to get the saved resume ID first
            const resumeId = await localforage.getItem(CONFIG.storage.userResumeKey || 'lastResumeId');

            if (!resumeId) {
                return null;
            }

            return new Promise((resolve, reject) => {
                const request = indexedDB.open('TechCareerMatchResumes', 1);

                request.onerror = function (event) {
                    console.error('Error opening resume database:', event.target.error);
                    reject(event.target.error);
                };

                request.onsuccess = function (event) {
                    const db = event.target.result;
                    const transaction = db.transaction(['resumes'], 'readonly');
                    const store = transaction.objectStore('resumes');

                    const getRequest = store.get(resumeId);

                    getRequest.onsuccess = function (event) {
                        const resumeData = event.target.result;

                        if (resumeData) {
                            // Return only metadata without file data
                            const metadata = { ...resumeData };
                            delete metadata.fileData;
                            resolve(metadata);
                        } else {
                            resolve(null);
                        }
                    };

                    getRequest.onerror = function (event) {
                        console.error('Error getting resume:', event.target.error);
                        reject(event.target.error);
                    };

                    transaction.oncomplete = function () {
                        db.close();
                    };
                };
            });
        } catch (error) {
            console.error('Error getting resume metadata:', error);
            return null;
        }
    },

    /**
     * Get the resume file data
     * @param {string} resumeId - Resume ID
     * @returns {Promise<Object>} Resume data including file content
     */
    getResumeFile: async function (resumeId) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('TechCareerMatchResumes', 1);

            request.onerror = function (event) {
                console.error('Error opening resume database:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = function (event) {
                const db = event.target.result;
                const transaction = db.transaction(['resumes'], 'readonly');
                const store = transaction.objectStore('resumes');

                // If no ID provided, try to get the last saved ID
                const getResumeData = function (id) {
                    const getRequest = store.get(id);

                    getRequest.onsuccess = function (event) {
                        const resumeData = event.target.result;
                        resolve(resumeData);
                    };

                    getRequest.onerror = function (event) {
                        console.error('Error getting resume:', event.target.error);
                        reject(event.target.error);
                    };
                };

                if (resumeId) {
                    getResumeData(resumeId);
                } else {
                    localforage.getItem(CONFIG.storage.userResumeKey || 'lastResumeId')
                        .then(id => {
                            if (id) {
                                getResumeData(id);
                            } else {
                                resolve(null);
                            }
                        })
                        .catch(err => {
                            console.error('Error getting resume ID:', err);
                            reject(err);
                        });
                }

                transaction.oncomplete = function () {
                    db.close();
                };
            };
        });
    },

    /**
     * Delete a resume file
     * @param {string} resumeId - Resume ID (if not provided, deletes the current resume)
     * @returns {Promise<boolean>} Success indicator
     */
    deleteResumeFile: async function (resumeId) {
        try {
            // If no ID provided, try to get the current resume ID
            if (!resumeId) {
                resumeId = await localforage.getItem(CONFIG.storage.userResumeKey || 'lastResumeId');

                if (!resumeId) {
                    return false; // No resume to delete
                }
            }

            return new Promise((resolve, reject) => {
                const request = indexedDB.open('TechCareerMatchResumes', 1);

                request.onerror = function (event) {
                    console.error('Error opening resume database:', event.target.error);
                    reject(event.target.error);
                };

                request.onsuccess = function (event) {
                    const db = event.target.result;
                    const transaction = db.transaction(['resumes'], 'readwrite');
                    const store = transaction.objectStore('resumes');

                    const deleteRequest = store.delete(resumeId);

                    deleteRequest.onsuccess = function () {
                        // Clear the last resume ID reference
                        localforage.removeItem(CONFIG.storage.userResumeKey || 'lastResumeId')
                            .then(() => {
                                resolve(true);
                            })
                            .catch(err => {
                                console.error('Error clearing resume ID:', err);
                                resolve(true); // Still consider deletion successful
                            });
                    };

                    deleteRequest.onerror = function (event) {
                        console.error('Error deleting resume:', event.target.error);
                        reject(event.target.error);
                    };

                    transaction.oncomplete = function () {
                        db.close();
                    };
                };
            });
        } catch (error) {
            console.error('Error deleting resume:', error);
            return false;
        }
    },

    /**
     * Extract text from resume file
     * @param {File} file - Resume file
     * @returns {Promise<string>} Extracted text
     */
    extractTextFromResume: async function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // This is a simplified implementation
                // In a real app, you would use specific libraries based on file type
                // (e.g., pdf.js for PDFs, mammoth for DOCX, etc.)
                
                let text = '';
                
                if (file.type === 'application/pdf') {
                    // For PDF files, you would use pdf.js in a real implementation
                    text = "PDF text extraction placeholder";
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    // For DOCX files, you would use mammoth.js in a real implementation
                    text = "DOCX text extraction placeholder";
                } else if (file.type === 'text/plain') {
                    // For text files, simply read as text
                    text = e.target.result;
                } else {
                    text = "Unsupported file format";
                }
                
                resolve(text);
            };
            
            reader.onerror = function() {
                reject(new Error('Error reading file'));
            };
            
            if (file.type === 'text/plain') {
                reader.readAsText(file);
            } else {
                // For other formats, in a real implementation you'd use
                // specific methods or libraries to extract text
                reader.readAsArrayBuffer(file);
            }
        });
    },

    /**
     * Handle resume file upload, including parsing and data extraction
     * @param {File} file - Resume file
     * @returns {Promise<Object>} Extracted data and metadata
     */
    processResumeUpload: async function (file) {
        try {
            // Extract text content from resume
            const resumeText = await this.extractTextFromResume(file);
            
            // Save the file
            const metadata = await this.saveResumeFile(file);

            // Extract data from resume text
            let extractedData = {
                name: '',
                email: '',
                phone: '',
                skills: [],
                experience: [],
                education: ''
            };

            // In a real implementation, you'd use NLP or regex to extract structured data
            // For demonstration, simulate successful extraction
            const fileNameParts = file.name.split('_');
            if (fileNameParts.length > 1) {
                extractedData.name = fileNameParts[0].replace(/([A-Z])/g, ' $1').trim();
            }

            // Update the stored resume metadata to include the text
            const updatedMetadata = {
                ...metadata,
                resumeText: resumeText
            };

            await localforage.setItem(CONFIG.storage.userResumeKey || 'lastResumeId', {
                id: metadata.id,
                resumeText: resumeText
            });

            Utils.showNotification(
                'Resume Uploaded',
                'Your resume has been saved successfully.',
                'success'
            );

            return {
                metadata: updatedMetadata,
                extractedData: extractedData
            };
        } catch (error) {
            console.error('Error processing resume upload:', error);

            Utils.showNotification(
                'Upload Failed',
                'There was an error processing your resume.',
                'error'
            );

            throw error;
        }
    },

    /**
     * Clear all stored data (for testing/reset)
     * @returns {Promise<boolean>} Success indicator
     */
    clearAllData: async function () {
        try {
            // Clear LocalForage data
            await localforage.clear();

            // Clear IndexedDB resume storage
            return new Promise((resolve, reject) => {
                const request = indexedDB.deleteDatabase('TechCareerMatchResumes');

                request.onerror = function (event) {
                    console.error('Error deleting resume database:', event.target.error);
                    reject(event.target.error);
                };

                request.onsuccess = function () {
                    resolve(true);
                };
            });
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    }
};