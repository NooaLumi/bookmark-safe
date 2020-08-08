import React from "react";

import {
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText,
} from "@material-ui/core";
import { BasicButton } from "./commonInputs";

const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }) => {
	return (
		<Dialog fullWidth maxWidth="sm" open={open} onClose={onCancel}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				{open && <DialogContentText>{message}</DialogContentText>}
			</DialogContent>
			<DialogActions>
				<BasicButton onClick={onConfirm} color="secondary">
					Confirm
				</BasicButton>
				<BasicButton onClick={onCancel} variant="outlined">
					Close
				</BasicButton>
			</DialogActions>
		</Dialog>
	);
};

export { ConfirmDialog };
