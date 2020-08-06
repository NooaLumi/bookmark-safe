import React from "react";
import moment from "moment";

export const BookmarkList = ({ bookmarks }) => {
	return (
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
	);
};
