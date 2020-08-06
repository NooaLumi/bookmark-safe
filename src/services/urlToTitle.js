import app from "./firebase";
import "firebase/functions";

const urlToTitle_cf = app.functions().httpsCallable("urlToTitle");

const urlToTitle = async (url) => {
	try {
		const res = await urlToTitle_cf({ url });
		const data = res.data.title;
		return data;
	} catch (err) {
		console.log("error:", err);
	}
};

export { urlToTitle };
