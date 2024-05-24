import React, { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { resolveApiErrors, ApiErrorsSnackbar } from 'features/ApiErrors';

import { http } from 'core/ApiClient';
import { Error } from 'core/types';

import { ErrorBox } from 'components/FormFields';
import { Navigation } from './Navigation';
import { informedReason, delayedReason } from '../constants';
import {
	AdditionalInformationFormValues,
	ClaimFormRoutes,
	NavigateFormRoute,
	StepNumber,
	AdditionalClaimFormFields,
	ClaimAdditionalStateInterfaceAPI,
} from '../types';
import {
	selectClaimAdditionalInfoFormValues,
	selectClaimFormId,
} from '../selectors';
import {
	setDelayedOption,
	setInformedOption,
} from '../reducer/additionalInfoReducer';
import { NavigationButtons } from './NavigationButtonsContainer';
import { setClaimForStep } from '../reducer/claimFormReducer';
import { selectLocale } from 'features/LanguageSelector';
import { Routes } from 'types/types';

export const AdditionalInformation: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [apiError, setApiError] = useState<Record<string, string> | null>(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const intl = useIntl();

	const additionalInfoVal = useSelector(selectClaimAdditionalInfoFormValues);
	const locale = useSelector(selectLocale);
	const claimId = useSelector(selectClaimFormId);

	const initialValues: AdditionalInformationFormValues = {
		[AdditionalClaimFormFields.informed]: additionalInfoVal.informed || null,
		[AdditionalClaimFormFields.delayed]: additionalInfoVal.delayed || null,
	};

	const validationSchema = yup.object().shape({
		[AdditionalClaimFormFields.informed]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[AdditionalClaimFormFields.delayed]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
	});

	const handleSubmit = async (
		values: AdditionalInformationFormValues,
		{ setErrors, setSubmitting }: FormikHelpers<AdditionalInformationFormValues>
	) => {
		setApiError(null);

		if (!claimId) {
			navigate(NavigateFormRoute[ClaimFormRoutes.Search]);
			dispatch(
				setClaimForStep({
					[ClaimFormRoutes.Search]: StepNumber.Search,
				})
			);
			return;
		}

		await http
			.put<ClaimAdditionalStateInterfaceAPI, AdditionalInformationFormValues>(
				`${Routes.Claims}/${claimId}${Routes.ClaimFormFlightDetails}`,
				{
					informed:
						informedReason(intl)[values.informed || ''].reason?.toString() ||
						'',
					delayed:
						delayedReason(intl)[values.delayed || ''].reason?.toString() || '',
				}
			)
			.then(() => {
				navigate(
					`${
						NavigateFormRoute[ClaimFormRoutes.ContactInformation]
					}?id=${claimId}`
				);
				dispatch(
					setClaimForStep({
						[ClaimFormRoutes.AdditionalInformation]:
							StepNumber.AdditionalInformation,
					})
				);
			})
			.catch((e: Error) => {
				const resolvedErrors = resolveApiErrors(
					e.cause.violations,
					AdditionalClaimFormFields,
					locale
				);
				if (resolvedErrors.formErrors) {
					setErrors(resolvedErrors.formErrors);
				}
				setApiError(resolvedErrors.globalErrors);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleDelayedOptionClick = (optionId: string) => {
		if (!optionId) return;
		const option = delayedReason(intl)[optionId];
		if (additionalInfoVal.delayed !== optionId) {
			dispatch(setDelayedOption(option.id));
		}
	};

	const handleInformedOptionClick = (optionId: string) => {
		if (!optionId) return;

		const option = informedReason(intl)[optionId];
		if (additionalInfoVal.informed !== optionId) {
			dispatch(setInformedOption(option.id));
		}
	};
	return (
		<>
			<ApiErrorsSnackbar
				messages={apiError}
				type="error"
				isOpen={!!apiError && !isLoading}
				handleClose={() => setApiError(null)}
			/>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, setFieldValue, values }) => (
					<Form noValidate autoComplete="off">
						<Grid container spacing={6} wrap="wrap">
							<Grid item xs={12}>
								<Box display="flex" justifyContent="center">
									<Typography variant="h4">
										<FormattedMessage id="claim.form.get.skyknight.compensation.title" />
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Navigation />
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h5" fontWeight={600}>
									<FormattedMessage id="claim.form.additional.information.time.to.informed.about.changes" />
								</Typography>
								<ErrorBox fieldName={AdditionalClaimFormFields.informed} />
								<Grid item xs={12} md={6}>
									<List>
										{Object.keys(informedReason(intl)).map((key) => (
											<ListItem
												key={informedReason(intl)[key].id}
												disablePadding
											>
												<ListItemButton
													key={informedReason(intl)[key].id}
													role={undefined}
													onClick={() => {
														handleInformedOptionClick(
															informedReason(intl)[key].id
														);
														setFieldValue(
															AdditionalClaimFormFields.informed,
															informedReason(intl)[key].id
														);
													}}
													dense
												>
													<ListItemIcon>
														<Checkbox
															name={AdditionalClaimFormFields.informed}
															icon={<RadioButtonUncheckedIcon />}
															checkedIcon={<RadioButtonCheckedIcon />}
															edge="start"
															checked={
																values.informed === informedReason(intl)[key].id
															}
															tabIndex={-1}
															disableRipple
														/>
													</ListItemIcon>
													<ListItemText
														id={informedReason(intl)[key].id}
														primary={informedReason(intl)[key].reason}
													/>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h5" fontWeight={600}>
									<FormattedMessage id="claim.form.additional.information.fly.late.title" />
								</Typography>
								<Typography color="secondary">
									<FormattedMessage id="claim.form.additional.information.fly.late.description" />
								</Typography>
								<ErrorBox fieldName={AdditionalClaimFormFields.delayed} />
								<Grid item xs={12} md={6}>
									<List>
										{Object.keys(delayedReason(intl)).map((key) => (
											<ListItem
												key={delayedReason(intl)[key].id}
												disablePadding
											>
												<ListItemButton
													key={delayedReason(intl)[key].id}
													role={undefined}
													onClick={() => {
														handleDelayedOptionClick(
															delayedReason(intl)[key].id
														);
														setFieldValue(
															AdditionalClaimFormFields.delayed,
															delayedReason(intl)[key].id
														);
													}}
													dense
												>
													<ListItemIcon>
														<Checkbox
															name={AdditionalClaimFormFields.delayed}
															icon={<RadioButtonUncheckedIcon />}
															checkedIcon={<RadioButtonCheckedIcon />}
															edge="start"
															checked={
																values.delayed == delayedReason(intl)[key].id
															}
															tabIndex={-1}
															disableRipple
														/>
													</ListItemIcon>
													<ListItemText
														id={delayedReason(intl)[key].id}
														primary={delayedReason(intl)[key].reason}
													/>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<NavigationButtons isDisabled={isSubmitting} />
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</>
	);
};
