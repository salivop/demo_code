import React, { useState } from 'react';
import { Field, Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ButtonBase from '@mui/material/ButtonBase';

import { ErrorBox } from 'components/FormFields';
import {
	DisruptionClaimFormFields,
	DisruptionReasonFormValues,
	NavigateFormRoute,
	ClaimFormRoutes,
	StepNumber,
	ClaimDisruptionStateInterfaceAPI,
} from '../types';

import { Navigation } from './Navigation';
import {
	setAirlineReasonOption,
	setUserReasonOption,
} from '../reducer/disruptionReasonReducer';
import { setClaimForStep } from '../reducer/claimFormReducer';
import { userDisruptionReasons, airlineDisruptionReasons } from '../constants';
import {
	selectClaimDisruptionReasonFormValues,
	selectClaimFormId,
} from '../selectors';
import { NavigationButtons } from './NavigationButtonsContainer';
import { http } from 'core/ApiClient';
import { Error } from 'core/types';
import { resolveApiErrors, ApiErrorsSnackbar } from 'features/ApiErrors';
import { Routes } from 'types/types';
import { selectLocale } from 'features/LanguageSelector';

export const DisruptionReason: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [apiError, setApiError] = useState<Record<string, string> | null>(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const intl = useIntl();
	const locale = useSelector(selectLocale);

	const claimId = useSelector(selectClaimFormId);
	const disruptionReasonVal = useSelector(
		selectClaimDisruptionReasonFormValues
	);

	const initialValues: DisruptionReasonFormValues = {
		[DisruptionClaimFormFields.userReason]:
			disruptionReasonVal.userReason || null,
		[DisruptionClaimFormFields.airlineReason]:
			disruptionReasonVal.airlineReason || null,
		[DisruptionClaimFormFields.details]: disruptionReasonVal.details || '',
	};

	const validationSchema = yup.object().shape({
		[DisruptionClaimFormFields.userReason]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[DisruptionClaimFormFields.airlineReason]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
	});

	const handleSubmit = async (
		{ userReason, airlineReason, details }: DisruptionReasonFormValues,
		{ setErrors, setSubmitting }: FormikHelpers<DisruptionReasonFormValues>
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

		setIsLoading(true);

		await http
			.put<ClaimDisruptionStateInterfaceAPI, ClaimDisruptionStateInterfaceAPI>(
				`${Routes.Claims}/${claimId}${Routes.ClaimsFormDisruptionReasons}`,
				{
					userReason:
						userDisruptionReasons(intl)[userReason || ''].reason?.toString() ||
						'',
					airlineReason:
						airlineDisruptionReasons(intl)[
							airlineReason || ''
						].reason?.toString() || '',
					details,
				}
			)
			.then(() => {
				navigate(
					`${
						NavigateFormRoute[ClaimFormRoutes.AdditionalInformation]
					}?id=${claimId}`
				);
				dispatch(
					setClaimForStep({
						[ClaimFormRoutes.DisruptionReason]: StepNumber.DisruptionReason,
					})
				);
			})
			.catch((e: Error) => {
				const resolvedErrors = resolveApiErrors(
					e.cause.violations,
					DisruptionClaimFormFields,
					locale
				);
				if (resolvedErrors.formErrors) {
					setErrors(resolvedErrors.formErrors);
				}
				setApiError(resolvedErrors.globalErrors);
			})
			.finally(() => {
				setSubmitting(false);
				setIsLoading(false);
			});
	};

	const handleReasonOptionClick = (optionId: string) => {
		if (!optionId) return;
		const option = userDisruptionReasons(intl)[optionId];
		if (disruptionReasonVal.userReason !== optionId) {
			dispatch(setUserReasonOption(option.id));
		}
	};

	const handleAirlineReasonOptionClick = (optionId: string) => {
		if (!optionId) return;
		const option = airlineDisruptionReasons(intl)[optionId];
		if (disruptionReasonVal.airlineReason !== optionId) {
			dispatch(setAirlineReasonOption(option.id));
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
									<Typography variant="h4" fontWeight={600}>
										<FormattedMessage id="claim.form.get.skyknight.compensation.title" />
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Navigation />
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h5" fontWeight={600}>
									<FormattedMessage id="claim.form.disruption.reason" />
								</Typography>
								<ErrorBox fieldName={DisruptionClaimFormFields.userReason} />
								<Grid item xs={12} md={6}>
									<List>
										{Object.keys(userDisruptionReasons(intl)).map((key) => (
											<ListItem
												key={userDisruptionReasons(intl)[key].id}
												disablePadding
											>
												<ListItemButton
													key={userDisruptionReasons(intl)[key].id}
													role={undefined}
													onClick={() => {
														handleReasonOptionClick(
															userDisruptionReasons(intl)[key].id
														);
														setFieldValue(
															DisruptionClaimFormFields.userReason,
															userDisruptionReasons(intl)[key].id
														);
													}}
													dense
												>
													<ListItemIcon>
														<Checkbox
															name={DisruptionClaimFormFields.userReason}
															icon={<RadioButtonUncheckedIcon />}
															checkedIcon={<RadioButtonCheckedIcon />}
															edge="start"
															checked={
																values.userReason ==
																userDisruptionReasons(intl)[key].id
															}
															tabIndex={-1}
															disableRipple
														/>
													</ListItemIcon>
													<ListItemText
														id={userDisruptionReasons(intl)[key].id}
														primary={userDisruptionReasons(intl)[key].reason}
													/>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h5" fontWeight={600}>
									<FormattedMessage id="claim.form.disruption.airline.reason.description" />
								</Typography>
								<ErrorBox fieldName={DisruptionClaimFormFields.airlineReason} />
								<Box
									sx={{
										display: {
											xs: 'grid',
											md: 'flex',
											flexDirection: 'row',
											flexWrap: 'wrap',
										},
									}}
								>
									{Object.keys(airlineDisruptionReasons(intl)).map((key) => (
										<div key={airlineDisruptionReasons(intl)[key].id}>
											<ButtonBase
												name={DisruptionClaimFormFields.airlineReason}
												key={airlineDisruptionReasons(intl)[key].id}
												onClick={() => {
													handleAirlineReasonOptionClick(
														airlineDisruptionReasons(intl)[key].id
													);
													setFieldValue(
														DisruptionClaimFormFields.airlineReason,
														airlineDisruptionReasons(intl)[key].id
													);
												}}
												sx={{ width: '100%' }}
											>
												<Card
													sx={{
														border:
															values.airlineReason ===
															airlineDisruptionReasons(intl)[key].id
																? 2
																: 'unset',
														borderColor: 'primary.main',
														width: { md: '120px', xs: '100%' },
														margin: '8px',
														height: { md: '145px', xs: '80px' },
													}}
												>
													<CardContent
														sx={{
															display: 'flex',
															flexDirection: { md: 'column', xs: 'rows' },
															alignItems: 'center',
															textAlign: 'center',
														}}
													>
														<Icon fontSize="large" sx={{ margin: '10px' }}>
															{airlineDisruptionReasons(intl)[key].icon}
														</Icon>
														<Typography
															sx={{ fontSize: 12 }}
															color="text.secondary"
															gutterBottom
														>
															{airlineDisruptionReasons(intl)[key].reason}
														</Typography>
													</CardContent>
												</Card>
											</ButtonBase>
										</div>
									))}
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h5" fontWeight={600}>
									<FormattedMessage id="claim.form.disruption.tell.us.more.title" />
								</Typography>
								<Typography color="secondary">
									<FormattedMessage id="claim.form.disruption.tell.us.more.description" />
								</Typography>
								<Field
									name={DisruptionClaimFormFields.details}
									type="text"
									fullWidth
									multiline
									maxRows={5}
									as={TextField}
								/>
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
