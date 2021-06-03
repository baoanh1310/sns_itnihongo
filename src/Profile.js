import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InstagramEmbed from 'react-instagram-embed';
import {Redirect, useParams} from 'react-router';
import { db } from "./firebase";
import Post from './Post';

function Profile() {
	const {uid} = useParams();
	const [user, setUser] = useState(undefined);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		db.collection('users').where('uid', '==', uid).get().then(snapshots => {
			if (snapshots.docs.length > 0) {
				setUser(snapshots.docs[0].data());
			} else {
				setUser(null);
			}
		})
	}, [uid]);

	useEffect(() => {
		if (user) {
			db.collection("posts")
      .orderBy("timestamp", "desc")
			.where('username', '==', user.username)
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
		}
	}, [user]);

	if (user === null) return <Redirect to={'/'} />

	if (user === undefined) return null;

	return (
		<div className="app" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<Avatar src="/static/images/avatar/1.jpg" alt={user.username} style={{width: 100, height: 100, marginTop: 50}} />
			<p style={{fontSize: 40}}>{user.username}</p>
			<p>Email: {user.email}</p>
			<div className="app__posts">
        <div className="app__postsLeft">
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
        <div className="app__postsLeft">
          <InstagramEmbed
            url="https://www.instagram/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
		</div>
	);
}

export default Profile;
