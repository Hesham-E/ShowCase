import React from 'react';
import "./ProfilePage.css";
import "./GeneralStyles.css";
import PostCard from './PostCard';

function ProfilePage() {
    let profilePic = require("../images/DefaultProfilePicture.png");
    let userName = "Tom Altankhuyag";
    let userBio = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

    return (
        <div className="ProfilePage">
            <img className="ProfilePic" src={profilePic} alt="" />
            <hr className='HeaderLine' />
            <span className='HeaderText'>{userName}</span>
            <span className='BodyText'>{userBio}</span>
            <hr className='HeaderLine' />
            <div className='SocialsButtons'>
                <button className='SocialButton'>Resume</button>
                <button className='SocialButton'>LinkedIn</button>
                <button className='SocialButton'>Email</button>
                <button className='SocialButton'>GitHub</button>
            </div>
            <hr className='HeaderLine' />
            <PostCard />
            <PostCard />
        </div>
    );
}

export default ProfilePage;