import { useState, useCallback } from "react";

export const useInput = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	// [value, setValue, reset, bind]
	return [
		value,
		setValue,
		useCallback(() => setValue(""), [setValue]),
		{
			value,
			onChange: useCallback(
				(e) => {
					setValue(e.target.value);
				},
				[setValue]
			),
		},
	];
};
