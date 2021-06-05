import React from 'react';
import Post from '../../Post';


const UserPost = ({ posts, user }) => {
    return (
        // <div className="userpost-item">
        //     <img className="userpost-image" src={post.imageUrl} alt="" />
        // </div>
        <div>
            {posts.length > 0 ? posts.map(({ id, post }) => (
                <Post
                    key={id}
                    username={post.username}
                    caption={post.caption}
                    imageUrl={post.imageUrl}
                    postId={id}
                    user={user}
                />
            )) : <p>Không có bài viết</p>}
        </div>
    );
};

export default UserPost;