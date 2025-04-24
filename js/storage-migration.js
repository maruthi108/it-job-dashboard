/**
 * Storage Migration for TechCareerMatch
 * This script migrates the application from DataManager to StorageService
 */

// Execute migration when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if migration has been done already
  if (!localStorage.getItem('storage_migration_complete')) {
    migrateToStorageService();
  }
});

/**
 * Migrate data from DataManager to StorageService
 */
async function migrateToStorageService() {
  try {
    console.log('Starting storage migration...');

    // Initialize the storage service
    await StorageService.init();

    // Only run migration if DataManager exists
    if (typeof DataManager !== 'undefined') {
      // Migrate profile data
      if (typeof DataManager.getUserProfile === 'function') {
        const profile = await DataManager.getUserProfile();
        if (Object.keys(profile).length > 0) {
          await StorageService.saveProfileData(profile);
          console.log('Profile data migrated successfully');
        }
      }

      // Migrate skills
      if (typeof DataManager.getUserSkills === 'function') {
        const skills = await DataManager.getUserSkills();
        if (skills && skills.length > 0) {
          await StorageService.saveSkills(skills);
          console.log('Skills data migrated successfully');
        }
      }

      // Migrate experience
      if (typeof DataManager.getUserExperience === 'function') {
        const experience = await DataManager.getUserExperience();
        if (experience && experience.length > 0) {
          await StorageService.saveExperience(experience);
          console.log('Experience data migrated successfully');
        }
      }

      // Migrate preferences
      if (typeof DataManager.getUserPreferences === 'function') {
        const preferences = await DataManager.getUserPreferences();
        if (Object.keys(preferences).length > 0) {
          await StorageService.savePreferences(preferences);
          console.log('Preferences data migrated successfully');
        }
      }

      // Migrate saved jobs
      if (typeof DataManager.getSavedJobs === 'function') {
        const savedJobs = await DataManager.getSavedJobs();
        if (savedJobs && savedJobs.length > 0) {
          await StorageService.saveJobApplications(savedJobs);
          console.log('Saved jobs migrated successfully');
        }
      }

      // Mark migration as complete
      localStorage.setItem('storage_migration_complete', 'true');
      localStorage.setItem('storage_migration_date', new Date().toISOString());
      console.log('Storage migration completed successfully');
    } else {
      console.log('DataManager not found, no migration needed');
      localStorage.setItem('storage_migration_complete', 'true');
    }
  } catch (error) {
    console.error('Error during storage migration:', error);
  }
}

/**
 * Extend StorageService with compatibility methods for DataManager
 * This ensures that existing code continues to work during transition
 */
function extendWithCompatibilityMethods() {
  // Only add compatibility if DataManager exists
  if (typeof DataManager !== 'undefined') {
    // Create compatibility layer for DataManager
    const DataManagerCompatibility = {
      // Proxy methods to StorageService
      getUserProfile: StorageService.getProfileData.bind(StorageService),
      updateUserProfile: StorageService.saveProfileData.bind(StorageService),
      getUserSkills: StorageService.getSkills.bind(StorageService),
      addUserSkill: StorageService.addSkill.bind(StorageService),
      updateUserSkill: StorageService.updateSkill.bind(StorageService),
      deleteUserSkill: StorageService.deleteSkill.bind(StorageService),
      getUserExperience: StorageService.getExperience.bind(StorageService),
      addUserExperience: StorageService.addExperience.bind(StorageService),
      updateUserExperience: StorageService.updateExperience.bind(StorageService),
      deleteUserExperience: StorageService.deleteExperience.bind(StorageService),
      getUserPreferences: StorageService.getPreferences.bind(StorageService),
      updateUserPreferences: StorageService.savePreferences.bind(StorageService),
      getSavedJobs: StorageService.getJobApplications.bind(StorageService),
      saveJob: StorageService.saveJob.bind(StorageService),
      removeSavedJob: StorageService.removeJob.bind(StorageService)
    };

    // Extend DataManager with compatibility methods
    Object.keys(DataManagerCompatibility).forEach(key => {
      if (typeof DataManager[key] === 'undefined' || window.overrideDataManager) {
        DataManager[key] = DataManagerCompatibility[key];
      }
    });

    console.log('Added DataManager compatibility layer');
  }
}

// Initialize compatibility layer after migration
document.addEventListener('DOMContentLoaded', function() {
  // Wait for StorageService to be available
  const checkStorageService = setInterval(function() {
    if (typeof StorageService !== 'undefined') {
      clearInterval(checkStorageService);
      extendWithCompatibilityMethods();
    }
  }, 100);
});