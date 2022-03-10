import React from 'react'
import "./PostCard.css";
import "./GeneralStyles.css";

function PostCard() {
    let postPic = require("../images/SortingRobot.png");
    let postTitle = "Automated Robot";
    let postDescription = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.";

    return (
        <div className='PostCard'>
            <div className='PostContent'>
                <img className='PostPic' src={postPic} alt=""/>
                <div className='PostText'>
                    <span className='HeaderText'>{postTitle}</span>
                    <span className='BodyText'>{postDescription}</span>
                </div>
            </div>

            <hr className='HeaderLine' />
        </div>
    );
}

export default PostCard;