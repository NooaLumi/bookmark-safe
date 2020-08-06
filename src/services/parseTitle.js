const getTitle = (title) => {
	let cleanTitle = title.match(/chapter/i) // Has word "chapter"
		? title.split(/chapter/i)[0]
		: title.match(/[0-9]/) && title.split(/[0-9]/)[0] !== "" // Chapter number after the title
		? title.split(/[0-9]/)[0]
		: title; // Catch-all

	// Clean up
	for (let i = 0; i < 3; i++) {
		cleanTitle = cleanTitle.replace(/-+$|_+$|\s+$/g, "");
	}

	return cleanTitle;
};

const getChapter = (title) => {
	const numbers = title.match(/^\d+|\d+\b|\d+(?=\w)/g);
	return numbers ? numbers[0] : "Unknown";
};

export { getTitle, getChapter };
