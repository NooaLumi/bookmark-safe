import React, { useState, useEffect } from "react";
import app from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";
import moment from "moment";

import { getTitle, getChapter } from "./services/parseTitle";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

app.initializeApp({
	apiKey: "AIzaSyCTQonL0mASQ0sDLG3YV8tVY5wvV4aWtog",
	authDomain: "bookmark-safe.firebaseapp.com",
	databaseURL: "https://bookmark-safe.firebaseio.com",
	projectId: "bookmark-safe",
	storageBucket: "bookmark-safe.appspot.com",
	messagingSenderId: "84173763200",
	appId: "1:84173763200:web:9460f2458b7b67550eac65",
});

const db = app.firestore();
const urlToTitle_cf = app.functions().httpsCallable("urlToTitle");

const urlToTitle = async (url) => {
	try {
		const res = await urlToTitle_cf({ url });
		const data = res.data.title;
		return data;
	} catch (err) {
		console.log("error:", err);
	}
};

const App = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [url, setUrl] = useState("");
	const [bookmarks, setBookmarks] = useState([]);

	const uiConfig = {
		signInFlow: "popup",
		signInOptions: [app.auth.GoogleAuthProvider.PROVIDER_ID],
	};

	useEffect(() => {
		app.auth().onAuthStateChanged((user) => {
			setIsSignedIn(!!user);
		});
	}, []);

	useEffect(() => {
		if (isSignedIn === true) {
			db.collection("users")
				.doc(app.auth().currentUser.uid)
				.collection("bookmarks")
				.orderBy("updated")
				.get()
				.then((querySnapshot) => {
					let bookmarks = [];
					querySnapshot.forEach((doc) => {
						bookmarks.push(doc.data());
					});
					setBookmarks(bookmarks);
				});
		}
	}, [isSignedIn]);

	const saveBookmark = async (title, chapter, url) => {
		try {
			const bookmark = {
				title,
				chapter,
				url,
				updated: app.firestore.FieldValue.serverTimestamp(),
			};

			await db
				.collection("users")
				.doc(app.auth().currentUser.uid)
				.collection("bookmarks")
				.add(bookmark);
			console.log("Bookmark written");

			setBookmarks([...bookmarks, bookmark]);
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const title = await urlToTitle(url);
			if (!title) {
				console.log("Error!");
			} else {
				const cleanTitle = title.replace(/&......;/g, ""); // Remove special char hexes
				await saveBookmark(
					getTitle(cleanTitle),
					getChapter(cleanTitle),
					url
				);
			}
		} catch (err) {
			console.log(err);
		}

		// Clear url field
		setUrl("");
	};

	const handleUrlChange = (e) => {
		setUrl(e.target.value);
	};

	const signOut = async () => {
		await app.auth().signOut();
		setIsSignedIn(false);
	};

	return (
		<div className="App">
			{isSignedIn ? (
				<>
					<p> Welcome, {app.auth().currentUser.displayName}!</p>
					<form onSubmit={handleSubmit} id="url-form">
						<label>
							Url:
							<input
								type="url"
								name="url"
								value={url}
								onChange={handleUrlChange}
							/>
						</label>
						<input type="submit" value="Submit" />
					</form>

					<ul>
						{bookmarks.map((bookmark, i) => (
							<li key={i}>
								<a
									rel="noopener noreferrer"
									target="_blank"
									href={bookmark.url}
								>
									{bookmark.title}
								</a>
								<span> — Chapter: {bookmark.chapter}</span>
								<span>
									{" "}
									—{" "}
									{moment(
										bookmark.updated.seconds
											? bookmark.updated.seconds * 1000
											: moment()
									).fromNow()}{" "}
								</span>
							</li>
						))}
					</ul>

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
/*
									{new Date(
										bookmark.updated.seconds
											? bookmark.updated.seconds * 1000
											: Date.now()
									).toLocaleString("fi-FI", {
										timezone: "Europe/Finland",
									})}
									*/

export default App;
