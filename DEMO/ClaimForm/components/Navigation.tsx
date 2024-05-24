import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getLastUrlItem } from 'utils/helpers';
import { Wizard } from 'components/Wizard';
import {
	ClaimFormRoutes,
	ClaimFormStepsMap,
	NavigateFormRoute,
} from '../types';
import { selectClaimFormId } from '../selectors';

export const Navigation: React.FC = () => {
	const intl = useIntl();
	const location = useLocation();
	const navigate = useNavigate();
	const claimId = useSelector(selectClaimFormId);

	const wizardStepsMap = {
		[ClaimFormRoutes.Search]: intl.formatMessage({
			id: 'claim.form.wizard.navigation.destination',
		}),
		[ClaimFormRoutes.DisruptionReason]: intl.formatMessage({
			id: 'claim.form.wizard.navigation.disruption',
		}),
		[ClaimFormRoutes.AdditionalInformation]: intl.formatMessage({
			id: 'claim.form.wizard.navigation.additional.info',
		}),
		[ClaimFormRoutes.ContactInformation]: intl.formatMessage({
			id: 'claim.form.wizard.navigation.contact',
		}),
	};

	const step = getLastUrlItem(location?.pathname) as ClaimFormRoutes;

	const handleStepClick = (stepId: string) => {
		const navigateLink = NavigateFormRoute[stepId as ClaimFormRoutes];
	
		if (claimId) {
			navigate(`${navigateLink}?id=${claimId}`);
		} else {
			navigate(navigateLink);
		}
	};

	return (
		<Wizard
			activeStep={ClaimFormStepsMap[step]}
			steps={wizardStepsMap}
			onClick={handleStepClick}
		/>
	);
};
