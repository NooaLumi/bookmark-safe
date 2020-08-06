import React, { useState, useEffect } from "react";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import app from "./services/firebase";
import { getBookmarks } from "./services/bookmark";

import { BookmarkList } from "./components/bookmarkList";
import { BookmarkForm } from "./components/bookmarkForm";

const App = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [bookmarks, setBookmarks] = useState([]);

	const uiConfig = {
		signInFlow: "popup",
		signInOptions: [app.auth.GoogleAuthProvider.PROVIDER_ID],
	};

	// Handle user authentication
	useEffect(() => {
		app.auth().onAuthStateChanged((user) => {
			setIsSignedIn(!!user);
		});
	}, []);

	// Fetch bookmarks
	useEffect(() => {
		if (isSignedIn === true) {
			getBookmarks().then((querySnapshot) => {
				let bookmarks = [];
				querySnapshot.forEach((doc) => {
					bookmarks.push(doc.data());
				});
				setBookmarks(bookmarks);
			});
		}
	}, [isSignedIn]);

	const signOut = async () => {
		await app.auth().signOut();
		setIsSignedIn(false);
	};

	const onBookmarkSave = (bookmark) => {
		setBookmarks([...bookmarks, bookmark]);
	};

	return (
		<div className="App">
			{isSignedIn ? (
				<>
					<p> Welcome, {app.auth().currentUser.displayName}!</p>
					<BookmarkForm onBookmarkSave={onBookmarkSave} />
					<BookmarkList bookmarks={bookmarks} />
					<br />
					<br />
					<br />
					<button onClick={signOut}> Sign Out</button>
				</>
			) : (
				<>
					<StyledFirebaseAuth
						uiConfig={uiConfig}
						firebaseAuth={app.auth()}
					/>
				</>
			)}
		</div>
	);
};

export default App;
