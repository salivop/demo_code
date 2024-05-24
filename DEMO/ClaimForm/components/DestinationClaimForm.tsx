import React, { useEffect, useState } from 'react';
import { Field, Formik, FormikHelpers, Form } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FlightTakeoff from '@mui/icons-material/FlightTakeoff';
import FlightLand from '@mui/icons-material/FlightLand';
import { resolveApiErrors, ApiErrorsSnackbar } from 'features/ApiErrors';
import { Error } from 'core/types';

import { FormFieldsContainer } from 'layouts/containers/FormFieldsContainer';
import { http } from 'core/ApiClient';
import { Routes } from 'types/types';
import { TextField } from 'components/FormFields';
import {
	DirectionFormValues,
	NavigateFormRoute,
	ClaimFormRoutes,
	StepNumber,
	DestinationClaimFormFields,
	ClaimSearchStateInterfaceAPI,
} from '../types';
import {
	AirportInterface,
	selectAllAirports,
	addAirports,
	setCurrentPage,
	selectCurrentPage,
	AirportsListAPI,
	setAirports,
} from 'features/Airport';
import { setClaimFormId, setClaimForStep } from '../reducer/claimFormReducer';
import {
	setPurchaseId,
	setArrivalAirport,
	setDepartureAirport,
} from '../reducer/destinationClaimReducer';
import { Navigation } from './Navigation';
import { SelectAirportField } from '../features/SelectAirportField';
import {
	selectClaimDestinationFormValues,
	selectClaimFormId,
	selectArrivalAirport,
	selectDepartureAirport,
} from '../selectors';
import { NavigationButtons } from './NavigationButtonsContainer';
import { selectLocale } from 'features/LanguageSelector';
import { ListPaginationConfig } from 'core/constants';

export const DestinationClaimForm: React.FC = () => {
	const [apiError, setApiError] = useState<Record<string, string> | null>(null);
	const [debouncedValue, setDebouncedValue] = useState<string | null>(null);
	const [value, setValue] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const intl = useIntl();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const locale = useSelector(selectLocale);
	const airports = useSelector(selectAllAirports);
	const claimDestinationFormVal = useSelector(selectClaimDestinationFormValues);
	const claimId = useSelector(selectClaimFormId);
	const arrivalAirportVal = useSelector(selectArrivalAirport);
	const departureAirportVal = useSelector(selectDepartureAirport);
	const currentAirportsPage = useSelector(selectCurrentPage);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			await http
				.get<AirportsListAPI>(
					`${Routes.Airports}?itemsPerPage=10`,
					ListPaginationConfig
				)
				.then((res) => {
					dispatch(setAirports(res.data));
					setIsLoading(false);
				})
				.catch((e: Error) => {
					setIsLoading(false);
					setApiError(
						resolveApiErrors(e.cause.violations, {}, locale).globalErrors
					);
				});
		};

		fetchData().catch((e: Error) => {
			setApiError(
				resolveApiErrors(e.cause.violations, {}, locale).globalErrors
			);
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), 500);
		return () => clearTimeout(timer);
	}, [value]);

	useEffect(() => {
		const controller = new AbortController();

		setIsLoading(true);
		setApiError(null);
		if (debouncedValue) {
			http
				.get<AirportsListAPI>(
					`${Routes.Airports}?itemsPerPage=10&search=${debouncedValue}`,
					ListPaginationConfig
				)
				.then((res) => {
					dispatch(addAirports(res.data));
					setIsLoading(false);
				})
				.catch((e: Error) => {
					setIsLoading(false);
					setApiError(
						resolveApiErrors(e.cause.violations, {}, locale).globalErrors
					);
				});
		}

		return () => controller.abort();
	}, [debouncedValue]);

	const handleAirportSearchValue = (searchVal: string) => {
		setValue(searchVal);
	};

	const initialValues: DirectionFormValues = {
		[DestinationClaimFormFields.purchaseCode]:
			claimDestinationFormVal.purchaseCode || '',
		[DestinationClaimFormFields.departureAirport]:
			claimDestinationFormVal.destination.departureAirport || claimId
				? departureAirportVal
				: null,
		[DestinationClaimFormFields.arrivalAirport]:
			claimDestinationFormVal.destination.arrivalAirport || claimId
				? arrivalAirportVal
				: null,
	};

	const validationSchema = yup.object().shape({
		[DestinationClaimFormFields.purchaseCode]: yup
			.string()
			.length(
				8,
				intl.formatMessage({ id: 'claim.form.skyknight.number.length' })
			)
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[DestinationClaimFormFields.departureAirport]: yup
			.object()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[DestinationClaimFormFields.arrivalAirport]: yup
			.object()
			.required(intl.formatMessage({ id: 'form.field.required' })),
	});

	const handleSubmit = async (
		{ purchaseCode, departureAirport, arrivalAirport }: DirectionFormValues,
		{ setErrors, setSubmitting }: FormikHelpers<DirectionFormValues>
	) => {
		setApiError(null);

		if (claimId) {
			navigate(
				`${NavigateFormRoute[ClaimFormRoutes.DisruptionReason]}?id=${claimId}`
			);
			dispatch(
				setClaimForStep({
					[ClaimFormRoutes.Search]: StepNumber.Search,
				})
			);
			return;
		}
		await http
			.post<ClaimSearchStateInterfaceAPI, { id: string }>(Routes.Claims, {
				purchaseCode,
				destination: {
					arrivalAirportIataCode: arrivalAirport?.code.iata || '',
					departureAirportIataCode: departureAirport?.code.iata || '',
					departureAirport: departureAirport?.title || '',
					arrivalAirport: arrivalAirport?.title || '',
				},
			})
			.then(({ id }) => {
				dispatch(setClaimFormId(id));
				dispatch(setPurchaseId(purchaseCode));
				navigate(
					`${NavigateFormRoute[ClaimFormRoutes.DisruptionReason]}?id=${id}`
				);
				dispatch(
					setClaimForStep({
						[ClaimFormRoutes.Search]: StepNumber.Search,
					})
				);
			})
			.catch((e: Error) => {
				const resolvedErrors = resolveApiErrors(
					e.cause.violations,
					DestinationClaimFormFields,
					locale
				);
				if (resolvedErrors.formErrors) {
					setErrors(resolvedErrors.formErrors);
				}
				setApiError(resolvedErrors.globalErrors);
			})
			.finally(() => {
				setIsLoading(false);
				setSubmitting(false);
			});
	};

	const handleSelectedValue = (val: AirportInterface, fieldName: string) => {
		if (fieldName === 'departureAirport') {
			dispatch(setDepartureAirport(val));
		}
		if (fieldName == 'arrivalAirport') {
			dispatch(setArrivalAirport(val));
		}
	};

	const handleLoadMoreAirports = () => {
		setIsLoading(true);
		http
			.get<AirportsListAPI>(
				`${Routes.Airports}?itemsPerPage=10&page=${currentAirportsPage + 1}`,
				ListPaginationConfig
			)
			.then((res) => {
				dispatch(setCurrentPage({ currentPage: res.meta.currentPage }));
				dispatch(addAirports(res.data));
			})
			.catch((e: Error) => {
				console.error(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
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
				{({ isSubmitting }) => (
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
								<FormFieldsContainer>
									<Field
										disabled={!!claimId}
										as={TextField}
										name={DestinationClaimFormFields.purchaseCode}
										type="text"
										label={intl.formatMessage({ id: 'claim.form.claim.id' })}
										infoText={intl.formatMessage({
											id: 'claim.form.claim.id.information',
										})}
									/>
								</FormFieldsContainer>
								<FormFieldsContainer>
									<div>
										<Typography variant="body2" color="secondary">
											<FormattedMessage id="claim.form.disrupted.departure.airport" />
										</Typography>
										<Field
											as={SelectAirportField}
											name={DestinationClaimFormFields.departureAirport}
											type="select"
											placeholder={intl.formatMessage({
												id: 'claim.form.airport.select.helper.text',
											})}
											startIcon={<FlightTakeoff />}
											onOptionChange={handleAirportSearchValue}
											options={airports}
											onSelectedChange={handleSelectedValue}
											loading={isLoading}
											disabled={!!claimId}
											handleLoadMore={handleLoadMoreAirports}
										/>
									</div>
									<div>
										<Typography variant="body2" color="secondary">
											<FormattedMessage id="claim.form.disrupted.arrival.airport" />
										</Typography>
										<Field
											as={SelectAirportField}
											name={DestinationClaimFormFields.arrivalAirport}
											type="select"
											placeholder={intl.formatMessage({
												id: 'claim.form.airport.select.helper.text',
											})}
											startIcon={<FlightLand />}
											onOptionChange={handleAirportSearchValue}
											options={airports}
											onSelectedChange={handleSelectedValue}
											loading={isLoading}
											disabled={!!claimId}
											handleLoadMore={handleLoadMoreAirports}
										/>
									</div>
								</FormFieldsContainer>
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
