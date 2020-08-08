import React, { useState } from "react";
import { Box, CircularProgress, Container } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import { styled } from "@material-ui/core/styles";

import { urlToTitle } from "../services/urlToTitle";
import { saveBookmark } from "../services/bookmark";
import { getTitle, getChapter } from "../services/parseTitle";
import { useInput } from "../hooks/useInput";

import {
	BasicInput,
	BasicButton,
	DangerButton,
	LargeInput,
} from "./commonInputs";

const FormContainer = styled(Container)(({ theme }) => ({
	padding: theme.spacing(2),
	margin: theme.spacing(1),
}));

export const BookmarkForm = ({ onBookmarkSave }) => {
	const [url, , resetUrl, bindUrl] = useInput("");
	const [title, setTitle, resetTitle, bindTitle] = useInput("");
	const [chapter, setChapter, resetChapter, bindChapter] = useInput("");
	const [loading, setLoading] = useState(false);

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
			setLoading(true);

			// Clear auto-fill inputs
			resetTitle();
			resetChapter();

			if (!url) {
				console.log("Error: No url");
				setLoading(false);
				return 0;
			}
			const title = await urlToTitle(url);
			if (!title) {
				console.log("Error: No response!");
				setLoading(false);
			} else {
				const cleanTitle = title.replace(/&......;/g, ""); // Remove special char hexes
				setTitle(getTitle(cleanTitle));
				setChapter(getChapter(cleanTitle));
				setLoading(false);
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	};

	return (
		<FormContainer>
			<form onSubmit={handleSubmit} id="url-form" autoComplete="off">
				<Box display="flex" flexWrap="wrap" alignItems="center">
					<BasicInput
						type="url"
						id="url"
						label="Url"
						variant="outlined"
						placeholder="Url"
						size="small"
						required
						fullWidth
						{...bindUrl}
					/>
					<Box
						display="flex"
						flexWrap="wrap"
						alignItems="center"
						width="100%"
					>
						<LargeInput
							type="text"
							id="title"
							label="Title"
							variant="outlined"
							placeholder="Title"
							size="small"
							required
							{...bindTitle}
						/>
						<BasicInput
							type="number"
							id="chapter"
							label="Chapter"
							variant="outlined"
							placeholder="Chapter"
							size="small"
							required
							{...bindChapter}
						/>

						<Box
							component="span"
							display="flex"
							alignItems="center"
						>
							<BasicButton
								color="primary"
								onClick={autoFillForm}
								type="button"
								endIcon={
									loading ? (
										<CircularProgress size={15} />
									) : (
										<CachedIcon>auto-fill</CachedIcon>
									)
								}
							>
								Auto-Fill
							</BasicButton>
						</Box>
					</Box>
				</Box>
				<Box
					marginTop={5}
					width="100%"
					display="flex"
					flexWrap="wrap"
					alignItems="center"
					justifyContent="flex-end"
				>
					<BasicButton
						variant="contained"
						color="primary"
						type="submit"
					>
						Submit
					</BasicButton>
					<DangerButton
						variant="outlined"
						onClick={clearForm}
						type="button"
					>
						Clear
					</DangerButton>
				</Box>
			</form>
		</FormContainer>
	);
};
