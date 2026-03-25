function ProfileCard({ user, onLogout }) {
    return (
        <div className="profile-card">
            <div className="avatar-placeholder">
                {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
                <p><strong>{user?.username}</strong></p>
                <p>{user?.email}</p>
            </div>
            <button onClick={onLogout}>Выйти</button>
        </div>
    );
}
export default ProfileCard;