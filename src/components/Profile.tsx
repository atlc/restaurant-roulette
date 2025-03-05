import React, { useState } from "react";
import { ConfirmationModal, UserProfile } from "../types";


interface ProfileProps {
    userProfile: UserProfile;
    currentProfileKey: string;
    setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmationModal>>;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, currentProfileKey, setConfirmModal }) => {
    const [newProfileName, setNewProfileName] = useState("");
    const [addProfileExpanded, setAddProfileExpanded] = useState(false);

    
    const toggleAddProfileSection = () => {
        setAddProfileExpanded(!addProfileExpanded);
    };

    const handleAddProfile = () => {
        if (newProfileName.trim() !== '') {
            const profileKey = newProfileName.trim().toLowerCase().replace(/\s+/g, '_');
            
            if (userProfile[profileKey]) {
                setConfirmModal({
                    isOpen: true,
                    title: "Profile Already Exists",
                    message: `A profile with the name "${newProfileName}" already exists.`,
                    onConfirm: resetModal,
                    onCancel: resetModal
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
            setConfirmModal({
                isOpen: true,
                title: "Cannot Delete Profile",
                message: "At least one profile must exist.",
                onConfirm: resetModal,
                onCancel: resetModal
            });
            return;
        }
        setConfirmModal({
            isOpen: true,
            title: "Delete Profile",
            message: `Are you sure you want to delete the profile "${userProfile[key].name}"?`,
            onConfirm: () => {
                const { [key]: deletedProfile, ...remainingProfiles } = userProfile;
                if (key === currentProfileKey) {
                    const newKey = Object.keys(remainingProfiles)[0];
                    setCurrentProfileKey(newKey);
                }
                
                setUserProfile(remainingProfiles);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleProfileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddProfile();
        }
    };
    
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
                    onKeyDown={handleProfileKeyDown}
                />
                <button className="success-button" onClick={handleAddProfile}>Add Profile</button>
            </div>

            <h4 className="profile-management-title">Manage Profiles</h4>
            <div className="profile-management-list">
                {Object.keys(userProfile).map((key) => (
                    <div className="profile-management-item" key={`manage-${key}`}>
                        <span>{userProfile[key].name}</span>
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
