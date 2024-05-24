import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import Button from '@mui/material/Button';

import { getLastUrlItem } from 'utils/helpers';
import { ClaimFormRoutes } from '../types';

interface Props {
	isDisabled: boolean;
	isLastStep?: boolean;
}

export const ContinueButton: React.FC<Props> = ({ isDisabled, isLastStep }) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const step = getLastUrlItem(location?.pathname);

		if (step !== ClaimFormRoutes.ClaimCompleted) {
			setIsVisible(true);
		}
	}, []);

	return isVisible ? (
		<Button
			type="submit"
			variant="contained"
			color="primary"
			disabled={isDisabled}
		>
			{isLastStep ? (
				<FormattedMessage id="claim.form.complete.button" />
			) : (
				<FormattedMessage id="claim.form.continue.button" />
			)}
		</Button>
	) : null;
};
