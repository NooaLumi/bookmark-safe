import React, { useState, useCallback } from "react";
import moment from "moment";
import {
	List,
	ListItem,
	ListItemText,
	Link,
	ListItemSecondaryAction,
	IconButton,
	CircularProgress,
	Box,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { ConfirmDialog } from "./confirmDialog";
import { BookmarkFilter } from "./bookmarkFilter";

const DeleteButton = styled(IconButton)(({ theme }) => ({
	"&:hover": {
		color: theme.palette.error.light,
		backgroundColor: `${theme.palette.error.main}20`,
	},
}));

const StyledListItem = styled(ListItem)((props) => ({
	backgroundColor:
		props.lit === "true"
			? `${props.theme.palette.background.paper}50`
			: "none",
	// borderBottom: "1px solid white",
}));

const getUpdateTime = (updated) => {
	return moment(
		updated.seconds ? updated.seconds * 1000 : moment()
	).fromNow();
};

export const BookmarkList = ({ bookmarks, onBookmarkDelete }) => {
	const [selected, setSelected] = useState(false);
	const [filter, setFilter] = useState(() => (items) =>
		items.filter(() => true)
	);

	const deleteSelected = () => {
		onBookmarkDelete(selected.id);
		setSelected(false);
	};

	const filterBookmarks = useCallback(
		(search) => {
			setFilter(() => (items) =>
				items.filter((i) =>
					i.title.toLowerCase().includes(search.toLowerCase())
				)
			);
		},
		[setFilter]
	);

	const openConfirm = (bookmark) => setSelected(bookmark);
	const closeConfirm = () => setSelected(false);

	return (
		<>
			<ConfirmDialog
				open={!!selected}
				title="Delete bookmark"
				message={`${selected.title} — Chapter ${selected.chapter}`}
				onCancel={closeConfirm}
				onConfirm={deleteSelected}
			/>
			<BookmarkFilter filterBookmarks={filterBookmarks} />
			<List>
				{bookmarks.length <= 0 ? (
					<Box align="center" m={5}>
						<CircularProgress />
					</Box>
				) : (
					filter(bookmarks).map((bookmark, i) => (
						<StyledListItem
							key={i}
							dense
							lit={i % 2 ? "false" : "true"}
						>
							<Link
								rel="noopener noreferrer"
								target="_blank"
								href={bookmark.url}
							>
								<ListItemText
									primary={`${bookmark.title} — Chapter ${bookmark.chapter}`}
									secondary={getUpdateTime(bookmark.updated)}
								/>
							</Link>
							<ListItemSecondaryAction
								onClick={() => openConfirm(bookmark)}
							>
								<DeleteButton edge="end" aria-label="delete">
									<DeleteIcon />
								</DeleteButton>
							</ListItemSecondaryAction>
						</StyledListItem>
					))
				)}
			</List>
		</>
	);
};
