import React from 'react';
import Post from '../../Post';
import './Profile.css'


const UserPost = ({ posts, user }) => {
    const userPosts = posts.length ? posts.map(({ id, post }) => {
        return (
            <div key={id} className="profile__userpost-item">
                <a href="#" className="profile__userpost-link">
                    <img className="profile__userpost-image" src={post.imageUrl} alt="" />
                </a>
                <div className="profile__userpost-icons">
                    <i className="profile__userpost-icon fas fa-heart" />
                    <span>40</span>
                    <i className="profile__userpost-icon fas fa-comment" />
                    <span>23</span>
                </div>
            </div>
        )
    }) : null
    return (
        <div className="profile__post-grid">
            <div className="profile__post-content">
                {userPosts}
            </div>
        </div>
    );
};

export default UserPost;