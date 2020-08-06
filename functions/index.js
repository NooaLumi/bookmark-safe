const functions = require("firebase-functions");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.saveUser = functions.auth.user().onCreate((user) => {
	db.collection("users").doc(user.uid).set({
		name: user.displayName,
	});
});

exports.urlToTitle = functions.https.onCall((data, context) => {
	// Get html response
	return fetch(data.url)
		.then((res) => {
			return res.text();
		})
		.then((html) => {
			// Parse html with cheerio
			const $ = cheerio.load(html);
			const title = $("title").html();
			console.log("Title: ", title);
			return {
				title: title,
			};
		});
});
