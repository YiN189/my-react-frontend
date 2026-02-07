import { useEffect, useState } from 'react';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form state
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    // Edit state
    const [editingId, setEditingId] = useState(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:3000/api/user';

    // Fetch users
    async function fetchUsers() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?page=${page}&limit=5`);
            const data = await response.json();
            console.log("API response:", data);
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [page]);

    // Create user
    async function handleCreate(e) {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    firstname,
                    lastname
                })
            });

            const data = await response.json();

            if (response.ok) {
                clearForm();
                fetchUsers();
                alert('User created successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user');
        }
    }

    // Update user
    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    firstname,
                    lastname
                })
            });

            const data = await response.json();

            if (response.ok) {
                clearForm();
                setEditingId(null);
                fetchUsers();
                alert('User updated successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user');
        }
    }

    // Delete user
    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                fetchUsers();
                alert('User deleted successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    }

    // Edit user (fill form)
    function handleEdit(user) {
        setEditingId(user._id);
        setEmail(user.email);
        setFirstname(user.firstname);
        setLastname(user.lastname);
    }

    // Clear form
    function clearForm() {
        setEmail('');
        setFirstname('');
        setLastname('');
        setEditingId(null);
    }

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>👥 User Management</h1>
                <p style={styles.subtitle}>Manage your application users</p>
            </div>

            {/* Form Card */}
            <div style={styles.card}>
                <form onSubmit={editingId ? handleUpdate : handleCreate}>
                    <h2 style={styles.cardTitle}>
                        {editingId ? '✏️ Edit User' : '➕ Add New User'}
                    </h2>

                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="user@example.com"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>First Name</label>
                            <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                placeholder="John"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                                placeholder="Doe"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="submit" style={editingId ? styles.updateButton : styles.createButton}>
                            {editingId ? '💾 Update User' : '✨ Create User'}
                        </button>

                        {editingId && (
                            <button type="button" onClick={clearForm} style={styles.cancelButton}>
                                ✖ Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Users List Card */}
            <div style={styles.card}>
                <div style={styles.listHeader}>
                    <h2 style={styles.cardTitle}>📋 Users List</h2>
                    <input
                        type="text"
                        placeholder="🔍 Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                {loading ? (
                    <div style={styles.loading}>
                        <div style={styles.spinner}></div>
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Email</th>
                                        <th style={styles.th}>First Name</th>
                                        <th style={styles.th}>Last Name</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={styles.emptyRow}>
                                                No users found. Create one above!
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} style={styles.tr}>
                                                <td style={styles.td}>{user.email}</td>
                                                <td style={styles.td}>{user.firstname}</td>
                                                <td style={styles.td}>{user.lastname}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: user.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                                                    }}>
                                                        {user.status || 'ACTIVE'}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        style={styles.editBtn}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        style={styles.deleteBtn}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={styles.pagination}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{
                                    ...styles.pageBtn,
                                    opacity: page === 1 ? 0.5 : 1
                                }}
                            >
                                ← Previous
                            </button>
                            <span style={styles.pageInfo}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{
                                    ...styles.pageBtn,
                                    opacity: page === totalPages ? 0.5 : 1
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '1000px',
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
        marginBottom: '20px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#475569',
        marginBottom: '6px',
    },
    input: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'all 0.2s',
        outline: 'none',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    createButton: {
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    updateButton: {
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cancelButton: {
        padding: '12px 28px',
        background: '#94a3b8',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    listHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
    },
    searchInput: {
        padding: '10px 16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '0.95rem',
        width: '250px',
        outline: 'none',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#64748b',
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
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        backgroundColor: '#f8fafc',
        color: '#475569',
        padding: '14px 16px',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '0.9rem',
        borderBottom: '2px solid #e2e8f0',
    },
    tr: {
        transition: 'background-color 0.2s',
    },
    td: {
        padding: '14px 16px',
        borderBottom: '1px solid #f1f5f9',
        color: '#334155',
    },
    emptyRow: {
        textAlign: 'center',
        padding: '40px',
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    statusBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    editBtn: {
        padding: '6px 14px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginRight: '8px',
        fontSize: '0.85rem',
    },
    deleteBtn: {
        padding: '6px 14px',
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0',
    },
    pageBtn: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    pageInfo: {
        color: '#475569',
        fontWeight: '500',
    },
};

export default UserManagement;
