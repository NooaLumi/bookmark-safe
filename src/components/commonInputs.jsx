import { styled } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

const BasicInput = styled(TextField)(({ theme }) => ({
	margin: theme.spacing(1),
}));

const LargeInput = styled(BasicInput)(({ theme }) => ({
	width: "100%",
	maxWidth: theme.spacing(100),
}));

const BasicButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(1),
}));

const DangerButton = styled(BasicButton)(({ theme }) => ({
	color: theme.palette.error.light,
	borderColor: theme.palette.error.light,
}));

export { BasicInput, BasicButton, DangerButton, LargeInput };
