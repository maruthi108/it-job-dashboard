/**
 * Additional fixes to remove validation for fields no longer in the form
 * This should be included in your JavaScript files after other modules are loaded
 */

// Override the ProfileManager.handleProfileFormSubmit method if it exists and has validation for removed fields
if (typeof ProfileManager !== 'undefined' && typeof ProfileManager.handleProfileFormSubmit === 'function') {
    const originalSubmitHandler = ProfileManager.handleProfileFormSubmit;

    ProfileManager.handleProfileFormSubmit = async function () {
        try {
            // Get form data
            const formData = {
                name: document.getElementById('user-name-input').value,
                email: document.getElementById('user-email').value,
                location: document.getElementById('user-location-input').value,
                education: document.getElementById('user-education').value,
                skills: document.getElementById('user-skills').value,
                experience: document.getElementById('user-experience').value,
                currentSalary: document.getElementById('user-current-salary').value
            };

            // Only validate name and email
            if (!formData.name || !formData.email) {
                Utils.showNotification(
                    'Error',
                    'Please enter your name and email.',
                    'error'
                );

                // Switch to the basic info tab
                this.switchProfileTab('basic-info');
                return false;
            }

            // Call DataManager saveProfile directly
            const result = await DataManager.saveProfile(formData);

            if (result) {
                // Update UI
                await this.loadUserProfile();

                // Close modal
                UI.closeModal('profile-modal');

                // Show success notification
                Utils.showNotification(
                    'Success',
                    'Profile updated successfully.',
                    'success'
                );

                // Refresh dashboard if needed
                if (typeof UI.refreshDashboard === 'function') {
                    UI.refreshDashboard();
                }

                return true;
            } else {
                Utils.showNotification(
                    'Error',
                    'update profile. Please try again.',
                    'error'
                );
                return false;
            }
        } catch (error) {
            console.error('Error in handleProfileFormSubmit:', error);
            Utils.showNotification(
                'Error',
                'updating your profile.',
                'error'
            );
            return false;
        }
    };
}

// If there's a validateProfileForm method, override it too
if (typeof ProfileManager !== 'undefined' && typeof ProfileManager._validateProfileForm === 'function') {
    ProfileManager._validateProfileForm = function () {
        // Get only the required fields
        const nameInput = document.getElementById('user-name-input');
        const emailInput = document.getElementById('user-email');

        // Validate name and email only
        if (!nameInput || !nameInput.value.trim()) {
            Utils.showNotification(
                'Error',
                'Please enter your name.',
                'error'
            );
            return false;
        }

        if (!emailInput || !emailInput.value.trim()) {
            Utils.showNotification(
                'Error',
                'Please enter your email address.',
                'error'
            );
            return false;
        }

        if (!Utils.isValidEmail(emailInput.value.trim())) {
            Utils.showNotification(
                'Error',
                'Please enter a valid email address.',
                'error'
            );
            return false;
        }

        return true;
    };
}

// If UI.populateProfileForm exists, modify it to not throw errors for missing fields
if (typeof UI !== 'undefined' && typeof UI.populateProfileForm === 'function') {
    const originalPopulateForm = UI.populateProfileForm;

    UI.populateProfileForm = async function () {
        try {
            const profile = await DataManager.getUserProfile();
            const preferences = await DataManager.getUserPreferences() || {};
            const skills = await DataManager.getUserSkills() || [];
            const domains = await DataManager.getUserDomains() || [];

            // Basic info - only set values if elements exist
            const setValueIfExists = (id, value) => {
                const element = document.getElementById(id);
                if (element && value) element.value = value;
            };

            // Set values only for fields that exist
            setValueIfExists('user-name-input', profile.name);
            setValueIfExists('user-email', profile.email);
            setValueIfExists('user-location-input', profile.location);
            setValueIfExists('user-education', profile.education);
            setValueIfExists('user-linkedin', profile.linkedin);

            // Skills & Experience
            setValueIfExists('user-skills', skills.map(skill => skill.name).join(', '));
            setValueIfExists('user-experience', profile.experience);
            setValueIfExists('user-current-salary', profile.currentSalary);

            // Remove any other fields that might cause errors

            // Switch to first tab
            this.switchProfileTab('basic-info');
        } catch (error) {
            console.error('Error populating profile form:', error);
        }
    };
}