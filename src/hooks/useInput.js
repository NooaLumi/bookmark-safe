import { useState } from "react";

export const useInput = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	// [value, setValue, reset, bind]
	return [
		value,
		setValue,
		() => setValue(""),
		{
			value,
			onChange: (e) => {
				setValue(e.target.value);
			},
		},
	];
};
