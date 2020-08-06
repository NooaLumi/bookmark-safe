import React from "react";
import { urlToTitle } from "../services/urlToTitle";
import { saveBookmark } from "../services/bookmark";
import { getTitle, getChapter } from "../services/parseTitle";
import { useInput } from "../hooks/useInput";

export const BookmarkForm = ({ onBookmarkSave }) => {
	const [url, , resetUrl, bindUrl] = useInput("");
	const [title, setTitle, resetTitle, bindTitle] = useInput("");
	const [chapter, setChapter, resetChapter, bindChapter] = useInput("");

	const clearForm = () => {
		resetUrl();
		resetTitle();
		resetChapter();
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const bookmark = await saveBookmark(title, chapter, url);
			!!bookmark && onBookmarkSave(bookmark);
		} catch (err) {
			console.log(err);
		}
		clearForm();
	};

	const autoFillForm = async () => {
		try {
			if (!url) {
				console.log("Error: No url");
				return 0;
			}
			const title = await urlToTitle(url);
			if (!title) {
				console.log("Error!");
			} else {
				const cleanTitle = title.replace(/&......;/g, ""); // Remove special char hexes
				setTitle(getTitle(cleanTitle));
				setChapter(getChapter(cleanTitle));
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form onSubmit={handleSubmit} id="url-form">
			<label htmlFor="url">
				Url:
				<input type="url" id="url" name="url" required {...bindUrl} />
			</label>

			<label htmlFor="title">
				Title:
				<input type="text" id="title" required {...bindTitle} />
			</label>
			<label htmlFor="chapter">
				Chapter:
				<input type="number" id="chapter" required {...bindChapter} />
			</label>
			<button onClick={autoFillForm} type="button">
				Auto-fill
			</button>
			<input type="submit" value="Submit" />
		</form>
	);
};
