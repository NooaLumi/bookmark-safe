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
			.add(bookmark);

		return bookmark;
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

export { saveBookmark, getBookmarks };
