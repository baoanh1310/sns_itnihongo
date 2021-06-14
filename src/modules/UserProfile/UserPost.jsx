import React, { useEffect, useState } from 'react';
import './Profile.css'
import { db } from "../../firebase";
import firebase from "firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Avatar } from '@material-ui/core';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        display: 'inline-flex'
    },
}));

const UserPost = ({ postId, username, caption, imageUrl, user }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            comment: doc.data(),
                        }))
                    );
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
    };

    const deleteComment = (id) => {
        db.collection("posts").doc(postId).collection("comments").doc(id).delete();
    };

    const deletePost = () => {
        db.collection("posts").doc(postId).delete();
    };

    return (
        <div className="profile__userpost-item" >
            <a href="#" className="profile__userpost-link" onClick={handleOpen}>
                <img className="profile__userpost-image" src={imageUrl} alt="" />
                <div className="profile__userpost-icons">
                    <i className="profile__userpost-icon fas fa-heart" />
                    <span>40</span>
                    <i className="profile__userpost-icon fas fa-comment" />
                    <span>{comments.length}</span>
                </div>
            </a>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="userpost-modal">
                        <img className="userpost-image" src={imageUrl} alt="" />
                        <div className="userpost-body">
                            <div className="userpost-heading">
                                <Avatar
                                    className=""
                                    alt="RafehQazi"
                                    src="/static/images/avatar/1.jpg"
                                />
                                <h3>{username}</h3>
                                <i className="far fa-trash-alt" onClick={deletePost} />
                            </div>
                            <div className="userpost-content">
                                <div className="userpost-caption">
                                    <span>
                                        <strong>{username} </strong>
                                    </span>
                                    <span>{caption}</span>
                                </div>
                                <div className="userpost-comments">
                                    {comments.map(({ id, comment }) => (
                                        <div className="userpost-comment" key={id} >
                                            <p>
                                                <strong>{comment.username}</strong> {comment.text}
                                            </p>
                                            {comment.username === username ? (
                                                <i className="userpost__deleteComment-icon fas fa-times"
                                                    onClick={() => deleteComment(id)}></i>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {user && (
                                <form className="userpost-commentbox">
                                    <input
                                        type="text"
                                        className="userpost-comment-area"
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button
                                        className="userpost-comment-btn"
                                        disabled={!comment}
                                        type="submit"
                                        onClick={postComment}
                                    >
                                        Post
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserPost;