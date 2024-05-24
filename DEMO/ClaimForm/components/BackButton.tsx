import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';

import { getLastUrlItem } from 'utils/helpers';
import { ClaimFormRoutes } from '../types';

export const BackButton: React.FC = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const step = getLastUrlItem(location?.pathname);

		if (
			step !== ClaimFormRoutes.ClaimCompleted &&
			step !== ClaimFormRoutes.Search
		) {
			setIsVisible(true);
		}
	}, []);

	const handleBack = () => {
		navigate(-1);
	};

	return isVisible ? (
		<Button variant="text" color="primary" onClick={() => handleBack()}>
			<FormattedMessage id="claim.form.back.button" />
		</Button>
	) : null;
};
