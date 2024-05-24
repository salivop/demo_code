import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	Routes,
	Route,
	Outlet,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';

import { NotFoundPage } from 'pages/NotFoundPage';

import { DestinationClaimForm } from './DestinationClaimForm';
import { DisruptionReason } from './DisruptionReasonForm';
import { AdditionalInformation } from './AdditionalInformationForm';
import { ContactInformation } from './ContactInformationForm';
import { ClaimFormCompleted } from './ClaimFormCompleted';
import { ClaimFormRoutes, NavigateFormRoute } from '../types';
import { selectFormSteps } from '../selectors';
import { useInitializeClaimEntity } from '../hooks';
import { ProgressBox } from 'components/ProgressIndicator';
import { ApiErrorsSnackbar } from 'features/ApiErrors';

export const ClaimForm: React.FC = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const steps = useSelector(selectFormSteps);
	const [searchParams] = useSearchParams();

	const claimId = searchParams.get('id');
	const initClaimForm = useInitializeClaimEntity(claimId);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (!steps && !claimId) {
			navigate(NavigateFormRoute[ClaimFormRoutes.Search]);
		}
	}, [pathname, claimId]);

	if (initClaimForm.isLoading) return <ProgressBox />;

	return (
		<>
			<ApiErrorsSnackbar
				messages={initClaimForm.error}
				type="error"
				isOpen={!!initClaimForm.error}
			/>
			<Routes>
				<Route element={<Outlet />}>
					<Route
						path={ClaimFormRoutes.Search}
						element={<DestinationClaimForm />}
					/>
					<Route
						path={ClaimFormRoutes.DisruptionReason}
						element={<DisruptionReason />}
					/>
					<Route
						path={ClaimFormRoutes.AdditionalInformation}
						element={<AdditionalInformation />}
					/>
					<Route
						path={ClaimFormRoutes.ContactInformation}
						element={<ContactInformation />}
					/>
					<Route
						path={ClaimFormRoutes.ClaimCompleted}
						element={<ClaimFormCompleted />}
					/>
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</>
	);
};
