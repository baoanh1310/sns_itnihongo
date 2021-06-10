import { Avatar, Button, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import { db, auth } from "../../firebase";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%) `,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Navbar = () => {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchUsers, setSearchUsers] = useState([]);

    const writeUserData = (user) => {
        db.collection('users').add(user);
    }

    const signUp = (event) => {
        event.preventDefault();

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                const user = {
                    email,
                    username,
                    uid: authUser.user.uid,
                }
                writeUserData(user);
                return authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((error) => alert(error.message));
        setOpen(false);
    };

    const signIn = (event) => {
        event.preventDefault();

        auth
            .signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message));

        setOpenSignIn(false);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, username]);

    useEffect(() => {
        if (searchValue !== '') {
            db.collection('users').get().then(snapshots => {
                setSearchUsers(snapshots.docs.filter(doc => doc.data().username.includes(searchValue)).map(doc => doc.data()));
            })
        } else {
            setSearchUsers([]);
        }
    }, [searchValue]);

    return (
        <div>
            <div className="app__header-2">
                <img
                    className="app__headerImage"
                    src="https://lh3.googleusercontent.com/2sREY-8UpjmaLDCTztldQf6u2RGUtuyf6VT5iyX3z53JS4TdvfQlX-rNChXKgpBYMw"
                    height="40px"
                    alt=""
                />
                {user && <div className="app__search">
                    {searchValue !== "" ? <i className="app_delete-icon fas fa-times" onClick={event => setSearchValue("")} /> : <i className="app__search-icon fas fa-search" />}
                    <input className="app__search-field" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm" />
                    <div className={`app__search-result ${searchUsers.length !== 0 ? "active" : ''}`}>
                        {searchUsers.map(searchUser => <Link key={searchUser.uid} className="app__search-link" to={`/${searchUser.uid}`} onClick={(event => setSearchValue(''))}><div className="app__search-item">
                            <Avatar
                                alt="RafehQazi"
                                src="/static/images/avatar/1.jpg"
                            />
                            <div className="app__search-info">
                                <div className="app__search-name">{searchUser.username}</div>
                                <div className="app__search-email">{searchUser.email}</div>
                            </div>
                        </div></Link>)}
                    </div>
                </div>}
                {user ? (
                    <div className="app__logoutContainer">
                        <Link to={`/${user.uid}`}>
                            <Avatar
                                className="post__avatar"
                                alt="RafehQazi"
                                src="/static/images/avatar/1.jpg"
                            />
                        </Link>
                        <Button onClick={() => auth.signOut()}>Logout</Button>
                    </div>
                ) : (
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                    </div>
                )}
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://lh3.googleusercontent.com/2sREY-8UpjmaLDCTztldQf6u2RGUtuyf6VT5iyX3z53JS4TdvfQlX-rNChXKgpBYMw"
                                height="40px"
                                alt=""
                            />
                        </center>
                        <Input
                            placeholder="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signUp}>
                            Sign Up
            </Button>
                    </form>
                </div>
            </Modal>
            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://lh3.googleusercontent.com/2sREY-8UpjmaLDCTztldQf6u2RGUtuyf6VT5iyX3z53JS4TdvfQlX-rNChXKgpBYMw"
                                height="40px"
                                alt=""
                            />
                        </center>
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signIn}>
                            Sign In
            </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Navbar;