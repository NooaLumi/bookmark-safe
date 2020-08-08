import React from "react";
import { styled } from "@material-ui/core/styles";
import { Paper, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { LargeInput } from "./commonInputs";
import IconButton from "@material-ui/core/IconButton";
import { useInput } from "../hooks/useInput";
import { useEffect } from "react";

const FilterContainer = styled(Paper)(({ theme }) => ({
	padding: `${theme.spacing(3)} ${theme.spacing(5)}`,
	marginTop: theme.spacing(2),
}));

const ClearButton = styled(IconButton)(({ theme }) => ({
	"&:hover": {
		background: "none",
	},
}));

const BookmarkFilter = ({ filterBookmarks }) => {
	const [search, , resetSearch, baseSearch] = useInput("");

	useEffect(() => {
		filterBookmarks(search);
	}, [search, filterBookmarks]);

	return (
		<FilterContainer>
			<LargeInput
				variant="outlined"
				size="small"
				id="filter-input"
				{...baseSearch}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<ClearButton size="small" onClick={resetSearch}>
								<ClearIcon />
							</ClearButton>
						</InputAdornment>
					),
				}}
			/>
		</FilterContainer>
	);
};

export { BookmarkFilter };
