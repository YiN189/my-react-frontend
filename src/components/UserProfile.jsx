import { useEffect, useState } from 'react';

function UserProfile() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Edit form state
    const [editMode, setEditMode] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');

    // Image upload state
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadError, setUploadError] = useState('');

    const API_URL = 'http://localhost:3000/api/user';
    const BACKEND_URL = 'http://localhost:3000';

    // Fetch all users for the selector dropdown
    async function fetchUsers() {
        try {
            const response = await fetch(`${API_URL}?page=1&limit=100`);
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Fetch single user profile
    async function fetchProfile(id) {
        if (!id) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
                setFirstname(data.firstname || '');
                setLastname(data.lastname || '');
                setEmail(data.email || '');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            fetchProfile(selectedUserId);
            setEditMode(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            setUploadError('');
        }
    }, [selectedUserId]);

    // Handle profile update
    async function handleSave() {
        setSaving(true);
        try {
            const response = await fetch(`${API_URL}/${selectedUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstname, lastname })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
                setEditMode(false);
                fetchProfile(selectedUserId);
                fetchUsers(); // refresh dropdown names
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
        setSaving(false);
    }

    // Handle file selection with validation
    function handleFileSelect(e) {
        const file = e.target.files[0];
        setUploadError('');

        if (!file) {
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        // Client-side image type validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Only image files are allowed (JPEG, PNG, GIF, WebP).');
            setSelectedFile(null);
            setPreviewUrl(null);
            e.target.value = '';
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    }

    // Handle image upload
    async function handleUpload() {
        if (!selectedFile) return;

        setUploading(true);
        setUploadError('');

        try {
            const formData = new FormData();
            formData.append('profileImage', selectedFile);

            const response = await fetch(`${API_URL}/${selectedUserId}/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile image uploaded successfully!');
                setSelectedFile(null);
                setPreviewUrl(null);
                fetchProfile(selectedUserId);
            } else {
                setUploadError(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadError('Error uploading image. Please try again.');
        }
        setUploading(false);
    }

    // Get the profile image URL
    function getProfileImageUrl() {
        if (profile?.profileImage) {
            return `${BACKEND_URL}${profile.profileImage}`;
        }
        return null;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>👤 User Profile</h1>
                <p style={styles.subtitle}>Manage your profile information</p>
            </div>

            {/* User Selector */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>🔍 Select User</h2>
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={styles.select}
                >
                    <option value="">-- Choose a user --</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.firstname} {user.lastname} ({user.email})
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div style={styles.card}>
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p style={{ color: '#64748b' }}>Loading profile...</p>
                    </div>
                </div>
            )}

            {profile && !loading && (
                <>
                    {/* Profile Card */}
                    <div style={styles.profileCard}>
                        {/* Avatar Section */}
                        <div style={styles.avatarSection}>
                            <div style={styles.avatarWrapper}>
                                {getProfileImageUrl() ? (
                                    <img
                                        src={getProfileImageUrl()}
                                        alt="Profile"
                                        style={styles.avatarImage}
                                    />
                                ) : (
                                    <div style={styles.avatarPlaceholder}>
                                        {(profile.firstname?.[0] || '?').toUpperCase()}
                                        {(profile.lastname?.[0] || '').toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h2 style={styles.profileName}>
                                {profile.firstname} {profile.lastname}
                            </h2>
                            <p style={styles.profileEmail}>{profile.email}</p>
                            <span style={{
                                ...styles.statusBadge,
                                backgroundColor: profile.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                            }}>
                                {profile.status || 'ACTIVE'}
                            </span>
                        </div>

                        {/* Profile Details */}
                        <div style={styles.detailsSection}>
                            <h3 style={styles.sectionTitle}>📋 Profile Details</h3>

                            <div style={styles.detailRow}>
                                <span style={styles.detailLabel}>ID</span>
                                <span style={styles.detailValue}>{profile._id}</span>
                            </div>

                            {!editMode ? (
                                <>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>First Name</span>
                                        <span style={styles.detailValue}>{profile.firstname}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Last Name</span>
                                        <span style={styles.detailValue}>{profile.lastname}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Email</span>
                                        <span style={styles.detailValue}>{profile.email}</span>
                                    </div>

                                    <button
                                        onClick={() => setEditMode(true)}
                                        style={styles.editButton}
                                    >
                                        ✏️ Edit Profile
                                    </button>
                                </>
                            ) : (
                                <div style={styles.editForm}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>First Name</label>
                                        <input
                                            type="text"
                                            value={firstname}
                                            onChange={(e) => setFirstname(e.target.value)}
                                            style={styles.input}
                                            required
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Last Name</label>
                                        <input
                                            type="text"
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                            style={styles.input}
                                            required
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={styles.input}
                                            required
                                        />
                                    </div>
                                    <div style={styles.buttonGroup}>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            style={styles.saveButton}
                                        >
                                            {saving ? '⏳ Saving...' : '💾 Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                setFirstname(profile.firstname);
                                                setLastname(profile.lastname);
                                                setEmail(profile.email);
                                            }}
                                            style={styles.cancelButton}
                                        >
                                            ✖ Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Upload Card */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>🖼️ Profile Image</h3>
                        <p style={styles.uploadHint}>
                            Upload a profile image (JPEG, PNG, GIF, or WebP only)
                        </p>

                        <div style={styles.uploadArea}>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleFileSelect}
                                style={styles.fileInput}
                                id="profileImageInput"
                            />
                            <label htmlFor="profileImageInput" style={styles.fileLabel}>
                                📁 Choose Image File
                            </label>

                            {selectedFile && (
                                <p style={styles.fileName}>
                                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                </p>
                            )}
                        </div>

                        {uploadError && (
                            <div style={styles.errorMessage}>
                                ⚠️ {uploadError}
                            </div>
                        )}

                        {previewUrl && (
                            <div style={styles.previewContainer}>
                                <p style={styles.previewLabel}>Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={styles.previewImage}
                                />
                            </div>
                        )}

                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                style={styles.uploadButton}
                            >
                                {uploading ? '⏳ Uploading...' : '⬆️ Upload Image'}
                            </button>
                        )}

                        {getProfileImageUrl() && (
                            <div style={styles.currentImageSection}>
                                <p style={styles.previewLabel}>Current Profile Image:</p>
                                <img
                                    src={getProfileImageUrl()}
                                    alt="Current profile"
                                    style={styles.currentImage}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '2.5rem',
        color: '#fff',
        marginBottom: '8px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '1.1rem',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    },
    cardTitle: {
        fontSize: '1.4rem',
        color: '#334155',
        marginBottom: '16px',
        marginTop: '0',
    },
    select: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '1rem',
        outline: 'none',
        backgroundColor: '#f8fafc',
        cursor: 'pointer',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    },
    avatarSection: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 24px 30px',
        textAlign: 'center',
    },
    avatarWrapper: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        margin: '0 auto 16px',
        overflow: 'hidden',
        border: '4px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        color: '#fff',
        fontWeight: '700',
    },
    profileName: {
        color: '#fff',
        fontSize: '1.6rem',
        marginBottom: '4px',
        fontWeight: '600',
    },
    profileEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '1rem',
        marginBottom: '12px',
    },
    statusBadge: {
        display: 'inline-block',
        padding: '4px 16px',
        borderRadius: '20px',
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    detailsSection: {
        padding: '24px',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: '#334155',
        marginBottom: '16px',
        marginTop: '0',
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #f1f5f9',
    },
    detailLabel: {
        fontWeight: '600',
        color: '#64748b',
        fontSize: '0.9rem',
    },
    detailValue: {
        color: '#334155',
        fontSize: '0.95rem',
        wordBreak: 'break-all',
        textAlign: 'right',
        maxWidth: '60%',
    },
    editButton: {
        marginTop: '20px',
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
    },
    editForm: {
        marginTop: '16px',
    },
    formGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    saveButton: {
        flex: 1,
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    cancelButton: {
        flex: 1,
        padding: '12px 28px',
        background: '#94a3b8',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    uploadHint: {
        color: '#64748b',
        fontSize: '0.9rem',
        marginBottom: '16px',
        marginTop: '0',
    },
    uploadArea: {
        border: '2px dashed #cbd5e1',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        marginBottom: '16px',
    },
    fileInput: {
        display: 'none',
    },
    fileLabel: {
        display: 'inline-block',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    fileName: {
        marginTop: '12px',
        color: '#475569',
        fontSize: '0.9rem',
    },
    errorMessage: {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '10px',
        marginBottom: '16px',
        fontSize: '0.9rem',
        border: '1px solid #fecaca',
    },
    previewContainer: {
        marginBottom: '16px',
        textAlign: 'center',
    },
    previewLabel: {
        color: '#475569',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginBottom: '8px',
    },
    previewImage: {
        maxWidth: '200px',
        maxHeight: '200px',
        borderRadius: '12px',
        objectFit: 'cover',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    uploadButton: {
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        marginBottom: '16px',
    },
    currentImageSection: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
    },
    currentImage: {
        maxWidth: '150px',
        maxHeight: '150px',
        borderRadius: '12px',
        objectFit: 'cover',
        border: '2px solid #e2e8f0',
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '40px',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px',
    },
};

export default UserProfile;
