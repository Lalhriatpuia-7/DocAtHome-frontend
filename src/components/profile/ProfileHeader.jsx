export const ProfileHeader = (profile) => {
    return (
        <header className="profile-header"> 
            <img src= {profile.displayPicture} alt="Profile" className="profile-picture"/>
            <h1 className="profile-name">{profile.name}</h1>
            <p className="address">{profile.address}</p>
            <button className="edit-profile-btn"><FontAwesomeIcon icon='pen-to-square'/></button>
        </header>
    );
}