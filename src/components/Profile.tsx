import React, { useState } from "react";
import { useProfileStore } from "../store/profile";
import { useModalStore } from "../store/modal";
import { RestaurantProfile } from "../types";

const Profile = () => {
    const [importedProfile, setImportedProfile] = useState("");

    const userProfile = useProfileStore(store => store.userProfile);
    const currentProfileKey = useProfileStore(store => store.currentProfileKey);
    const newProfileName = useProfileStore(store => store.newProfileName);
    const addProfileExpanded = useProfileStore(store => store.addProfileExpanded);

    const setUserProfile = useProfileStore(store => store.setUserProfile);
    const setCurrentProfileKey = useProfileStore(store => store.setCurrentProfileKey);
    const setNewProfileName = useProfileStore(store => store.setNewProfileName);
    const setAddProfileExpanded = useProfileStore(store => store.setAddProfileExpanded);

    const launchModal = useModalStore(store => store.launch);
    const setIsOpen = useModalStore(store => store.setIsOpen);

    const toggleAddProfileSection = () => {
        setAddProfileExpanded(!addProfileExpanded);
    };

    const handleAddProfile = () => {
        if (newProfileName.trim() !== '') {
            const profileKey = newProfileName.trim().toLowerCase().replace(/\s+/g, '_');

            if (userProfile[profileKey]) {
                launchModal({
                    title: "Profile Already Exists",
                    message: `A profile with the name "${newProfileName}" already exists.`,
                    showButtons: false
                });
                return;
            }

            const updatedProfile = {
                ...userProfile,
                [profileKey]: {
                    name: newProfileName.trim(),
                    isActive: false,
                    restaurants: []
                }
            };

            setUserProfile(updatedProfile);
            setNewProfileName('');
            setCurrentProfileKey(profileKey);
            setAddProfileExpanded(false);
        }
    };

    const handleDeleteProfile = (key: string) => {
        // Don't allow deleting the last profile
        if (Object.keys(userProfile).length <= 1) {
            launchModal({
                title: "Cannot Delete Profile",
                message: "At least one profile must exist.",
                showButtons: false
            });
            return;
        }

        const executeDeleteProfile = () => {
            const { [key]: deletedProfile, ...remainingProfiles } = userProfile;
    
            if (key === currentProfileKey) {
                const newKey = Object.keys(remainingProfiles)[0];
                setCurrentProfileKey(newKey);
            }

            setUserProfile(remainingProfiles);
            setIsOpen(false);
        }

        launchModal({
            title: "Delete Profile",
            message: `Are you sure you want to delete the profile "${userProfile[key].name}"?`,
            onConfirm: executeDeleteProfile,
            showButtons: true
        });
    };

    const handleEnterForNewProfile = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddProfile();
        }
    };

    const handleExportProfile = (key: string) => {
        const profile = userProfile[key];
        const json = JSON.stringify(profile);
        window.navigator.clipboard.writeText(json);
        launchModal({
            title: `"${profile.name}" Copied to Clipboard`,
            message: json,
            showButtons: false
        });
    }

    const handleImportProfile = () => {
        const profile = JSON.parse(importedProfile) as RestaurantProfile;
        const key = profile.name.trim().toLowerCase().replace(/\s+/g, '_');
        setUserProfile({
            ...userProfile,
            [key]: profile
        });
        setImportedProfile('');
    }

    return <div className="profile-section">
        <div className="profile-header">
            <h3>Profiles</h3>
            <div onClick={toggleAddProfileSection} className={`toggle-icon ${addProfileExpanded ? 'expanded' : ''}`}>
                ▼
            </div>
        </div>

        <div className={`add-profile-content ${addProfileExpanded ? 'expanded' : ''}`}>
            <div className="row" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <input
                    type="text"
                    placeholder="Enter new profile name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={handleEnterForNewProfile}
                />
                <button className="success-button" onClick={handleAddProfile}>Add Profile</button>
            </div>

            <hr />

            <div className="row profile-import-row">
                <input
                    type="text"
                    placeholder={`{"name":"Work","restaurants":[{"name":"Foo","weight":0.5},{"name":"Bar","weight":0.5},{"name":"Baz's","weight":0.5}]}`}
                    value={importedProfile}
                    onChange={(e) => setImportedProfile(e.target.value)}
                />
                <button 
                    disabled={!importedProfile} 
                    className="success-button" 
                    onClick={handleImportProfile}
                >
                    Import Profile
                </button>
            </div>

            <h4 className="profile-management-title">Manage Existing Profiles</h4>
            <div className="profile-management-list">
                {Object.keys(userProfile).map((key) => (
                    <div className="profile-management-item" key={`manage-${key}`}>
                        <span>{userProfile[key].name}</span>
                        <span onClick={() => handleExportProfile(key)}>Export</span>
                        {Object.keys(userProfile).length > 1 && (
                            <span
                                className="remove-btn"
                                onClick={() => handleDeleteProfile(key)}
                            >
                                ×
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="profile-list">
            {Object.keys(userProfile).map((key) => (
                <div
                    className={`profile-item ${key === currentProfileKey ? 'active' : ''}`}
                    key={key}
                    onClick={() => setCurrentProfileKey(key)}
                >
                    <span>{userProfile[key].name}</span>
                </div>
            ))}
        </div>
    </div>;
};

export default Profile;
