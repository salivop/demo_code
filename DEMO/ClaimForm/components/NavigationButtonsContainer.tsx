import React from 'react';

import Box from '@mui/material/Box';

import { ContinueButton } from './ContinueButton';
import { BackButton } from './BackButton';

interface Props {
	isDisabled: boolean;
	isLastStep?: boolean;
}

export const NavigationButtons: React.FC<Props> = ({
	isDisabled,
	isLastStep,
}) => (
	<Box>
		<ContinueButton isLastStep={isLastStep} isDisabled={isDisabled} />
		<BackButton />
	</Box>
);
