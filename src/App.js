import React, { useState, useEffect } from "react";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {
	createMuiTheme,
	ThemeProvider,
	styled,
	responsiveFontSizes,
} from "@material-ui/core/styles";
import {
	CssBaseline,
	Container,
	Typography,
	Button,
	Box,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import app from "./services/firebase";
import { getBookmarks, deleteBookmark } from "./services/bookmark";
import { BookmarkList } from "./components/bookmarkList";
import { BookmarkForm } from "./components/bookmarkForm";

const MainContainer = styled(Container)(({ theme }) => ({
	padding: theme.spacing(5),
}));

const SignOutButton = styled(Button)(({ theme }) => ({
	color: theme.palette.error.light,
	borderColor: theme.palette.error.light,
}));

const StyledSummary = styled(AccordionSummary)(({ theme }) => ({
	padding: `0 ${theme.spacing(6)}`,
}));

const FormAccordion = styled(Accordion)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	"&:before": {
		display: "none",
	},
}));

const App = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [bookmarks, setBookmarks] = useState([]);

	const uiConfig = {
		signInFlow: "popup",
		signInOptions: [app.auth.GoogleAuthProvider.PROVIDER_ID],
	};

	const theme = responsiveFontSizes(
		createMuiTheme({
			spacing: (factor) => `${0.25 * factor}rem`,
			palette: {
				primary: {
					main: "#80DED9",
				},
				secondary: {
					main: "#e57373",
				},
				type: "dark",
			},
		})
	);

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
					bookmarks.push({ id: doc.id, ...doc.data() });
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

	const onBookmarkDelete = async (id) => {
		await deleteBookmark(id);
		setBookmarks(bookmarks.filter((i) => i.id !== id));
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<MainContainer maxWidth="md">
				{isSignedIn ? (
					<>
						<Typography
							variant="h2"
							gutterBottom={true}
							align="center"
							noWrap={true}
						>
							Bookmark bank
						</Typography>
						<FormAccordion>
							<StyledSummary expandIcon={<ExpandMoreIcon />}>
								<Typography variant="body1">
									Add New Bookmark
								</Typography>
							</StyledSummary>
							<AccordionDetails>
								<BookmarkForm onBookmarkSave={onBookmarkSave} />
							</AccordionDetails>
						</FormAccordion>
						<BookmarkList
							bookmarks={bookmarks}
							onBookmarkDelete={onBookmarkDelete}
						/>
						<Divider />
						<Box marginTop={10}>
							<SignOutButton variant="outlined" onClick={signOut}>
								Sign Out
							</SignOutButton>
						</Box>
					</>
				) : (
					<>
						<StyledFirebaseAuth
							uiConfig={uiConfig}
							firebaseAuth={app.auth()}
						/>
					</>
				)}
			</MainContainer>
		</ThemeProvider>
	);
};

export default App;
