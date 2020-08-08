import "firebase/auth";
import app from "./firebase";
import { db } from "./firestore";

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
			.add(bookmark)
			.then((docRef) => {
				bookmark.id = docRef.id;
			});

		return bookmark;
	} catch (err) {
		console.log(err);
		return false;
	}
};

const deleteBookmark = async (id) => {
	try {
		await db
			.collection("users")
			.doc(app.auth().currentUser.uid)
			.collection("bookmarks")
			.doc(id)
			.delete();
		return 0;
	} catch (err) {
		console.log(err);
	}
};

const getBookmarks = () =>
	db
		.collection("users")
		.doc(app.auth().currentUser.uid)
		.collection("bookmarks")
		.orderBy("updated")
		.get();

export { saveBookmark, getBookmarks, deleteBookmark };
