import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';

import { useSelector, useDispatch } from 'react-redux';
import { Field, Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ListPaginationConfig } from 'core/constants';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { http } from 'core/ApiClient';
import { Error } from 'core/types';
import { resolveApiErrors, ApiErrorsSnackbar } from 'features/ApiErrors';

import { FormFieldsContainer } from 'layouts/containers/FormFieldsContainer';
import {
	TextField as FormTextField,
	DatePicker,
	SelectField,
	Option,
	DateFormats,
} from 'components/FormFields';
import { Navigation } from './Navigation';
import {
	ContactInformationFormValues,
	PhoneSelectOption,
	StepNumber,
	ClaimFormRoutes,
	NavigateFormRoute,
	ContactClaimFormFields,
	ContactFormClaimStateInterfaceAPI,
} from '../types';
import {
	setCountry,
	setPhoneCode,
	setContactDetailsForm,
	setBirthDate,
	setContactPhoneNumber,
} from '../reducer/contactInfoReducer';
import {
	selectClaimContactFormValues,
	selectClaimFormId,
	selectCountry,
} from '../selectors';
import { PhoneDialogSelect } from '../features/PhoneDialogField';
import { NavigationButtons } from './NavigationButtonsContainer';
import { setClaimForStep } from '../reducer/claimFormReducer';
import { Routes } from 'types/types';
import { selectLocale } from 'features/LanguageSelector';
import {
	setCountries,
	addCountries,
	CountriesListAPI,
	selectAllCountriesIdNamePhoneCode,
	selectCurrentPage,
	setCurrentPage,
} from 'features/Country';
import { AirportsListAPI, setAirports } from 'features/Airport';

export const ContactInformation: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [apiError, setApiError] = useState<Record<string, string> | null>(null);
	const [debouncedValue, setDebouncedValue] = useState<string | null>(null);
	const [value, setValue] = useState<string>('');

	const intl = useIntl();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const contactFormVal = useSelector(selectClaimContactFormValues);
	const claimId = useSelector(selectClaimFormId);
	const locale = useSelector(selectLocale);
	const countries = useSelector(selectAllCountriesIdNamePhoneCode);
	const country = useSelector(selectCountry);
	const currentCountriesPage = useSelector(selectCurrentPage);
	const currentAirportsPage = useSelector(selectCurrentPage);

	useEffect(() => {
		const fetchCountries = async () =>
			http.get<CountriesListAPI>(
				`${Routes.Countries}?itemsPerPage=10`,
				ListPaginationConfig
			);

		const fetchAirports = async () =>
			http.get<AirportsListAPI>(
				`${Routes.Airports}?itemsPerPage=10`,
				ListPaginationConfig
			);

		const fetchData = async () => {
			setIsLoading(true);
			await Promise.all([fetchCountries(), fetchAirports()])
				.then((res) => {
					dispatch(setCountries(res[0].data));
					dispatch(setAirports(res[1].data));
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
		if (debouncedValue) {
			http
				.get<CountriesListAPI>(
					`${Routes.Countries}?itemsPerPage=10&search=${debouncedValue}`,
					ListPaginationConfig
				)
				.then((res) => {
					dispatch(addCountries(res.data));
					setIsLoading(false);
				})
				.catch((e: Error) => {
					console.error(e);
					setIsLoading(false);
				});
		}

		return () => controller.abort();
	}, [debouncedValue]);

	const initialValues: ContactInformationFormValues = {
		[ContactClaimFormFields.firstName]: contactFormVal.firstName || '',
		[ContactClaimFormFields.lastName]: contactFormVal.lastName || '',
		[ContactClaimFormFields.birthDate]: contactFormVal.birthDate || '',
		[ContactClaimFormFields.email]: contactFormVal.email || '',
		[ContactClaimFormFields.repeatEmail]: contactFormVal.repeatEmail || '',
		[ContactClaimFormFields.address]: contactFormVal.address || '',
		[ContactClaimFormFields.city]: contactFormVal.city || '',
		[ContactClaimFormFields.country]: contactFormVal.country || null,
		phoneCode: contactFormVal.phoneCode || null,
		[ContactClaimFormFields.phoneNumber]: contactFormVal.phoneNumber || '',
	};

	const validationSchema = yup.object().shape({
		[ContactClaimFormFields.firstName]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.lastName]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.birthDate]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.email]: yup
			.string()
			.email(intl.formatMessage({ id: 'form.field.email' }))
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.repeatEmail]: yup
			.string()
			.email(intl.formatMessage({ id: 'form.field.email' }))
			.oneOf(
				[yup.ref('email')],
				intl.formatMessage({
					id: 'claim.form.skyknight.email.fields.should.match',
				})
			)
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.address]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.city]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.country]: yup
			.object()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		phoneCode: yup
			.object()
			.required(intl.formatMessage({ id: 'form.field.required' })),
		[ContactClaimFormFields.phoneNumber]: yup
			.string()
			.required(intl.formatMessage({ id: 'form.field.required' })),
	});

	const handleCountriesSearchValue = (searchVal: string) => {
		setValue(searchVal);
	};

	const handleCountrySelect = (option: Option) => {
		if (contactFormVal.country?.id === option?.id) return;

		dispatch(setCountry(!option ? null : option));
	};
	const handleSubmit = async (
		values: ContactInformationFormValues,
		{ setErrors, setSubmitting }: FormikHelpers<ContactInformationFormValues>
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
			.put<
				ContactFormClaimStateInterfaceAPI,
				ContactFormClaimStateInterfaceAPI
			>(`${Routes.Claims}/${claimId}${Routes.ClaimFormContactDetails}`, {
				firstName: values.firstName,
				lastName: values.lastName,
				birthDate: dayjs(values.birthDate).format(DateFormats.YYYY_MM_DD),
				email: values.email,
				address: values.address,
				city: values.city,
				country: values.country?.name || '',
				countryCode: values.country?.id || '',
				phoneNumber: values.phoneNumber,
				phoneCode: values.phoneCode?.phoneCode || '',
			})
			.then(() => {
				dispatch(setContactDetailsForm(values));
				navigate(
					`${NavigateFormRoute[ClaimFormRoutes.ClaimCompleted]}?id=${claimId}`
				);
				dispatch(
					setClaimForStep({
						[ClaimFormRoutes.ContactInformation]: StepNumber.ContactInformation,
					})
				);
			})
			.catch((e: Error) => {
				const resolvedErrors = resolveApiErrors(
					e.cause.violations,
					ContactClaimFormFields,
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

	const handlePhoneCodeValue = (option: PhoneSelectOption) => {
		if (option?.phoneCode === contactFormVal.phoneCode?.phoneCode) return;
		dispatch(setPhoneCode(option));
		dispatch(setContactPhoneNumber(option.phoneCode));
	};

	const handleBlurPhoneNumber = (phoneNumberBlur: string) => {
		dispatch(setContactPhoneNumber(phoneNumberBlur));
	};

	const handleLoadMoreCountries = () => {
		setIsLoading(true);
		http
			.get<CountriesListAPI>(
				`${Routes.Countries}?itemsPerPage=10&page=${currentCountriesPage + 1}`,
				ListPaginationConfig
			)
			.then((res) => {
				dispatch(setCurrentPage({ currentPage: res.meta.currentPage }));
				dispatch(addCountries(res.data));
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
									<FormattedMessage id="claim.form.contact.information.basic.title" />
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormFieldsContainer>
									<Field
										as={FormTextField}
										name={ContactClaimFormFields.firstName}
										type="text"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.basic.name',
										})}
									/>
									<Field
										as={FormTextField}
										name={ContactClaimFormFields.lastName}
										type="text"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.basic.surname',
										})}
									/>
									<Field
										as={DatePicker}
										value={contactFormVal.birthDate}
										name={ContactClaimFormFields.birthDate}
										type="string"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.basic.birth.date',
										})}
										fullWidth
										onChange={(date: string) => {
											setFieldValue(ContactClaimFormFields.birthDate, date);
											setBirthDate(date);
										}}
									/>
								</FormFieldsContainer>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h5" fontWeight={600}>
									<FormattedMessage id="claim.form.contact.information.contact.title" />
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormFieldsContainer>
									<Field
										as={FormTextField}
										name={ContactClaimFormFields.email}
										type="email"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.contact.email',
										})}
									/>
									<Field
										as={FormTextField}
										name={ContactClaimFormFields.repeatEmail}
										type="email"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.contact.repeat.email',
										})}
									/>
									<Field
										as={FormTextField}
										name={ContactClaimFormFields.address}
										type="text"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.contact.address',
										})}
									/>
									<Field
										as={FormTextField}
										name={ContactClaimFormFields.city}
										type="text"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.contact.city',
										})}
									/>
									<Field
										as={SelectField}
										options={countries}
										onChange={handleCountrySelect}
										name={ContactClaimFormFields.country}
										type="object"
										label={intl.formatMessage({
											id: 'claim.form.contact.information.contact.country',
										})}
										onInputChange={handleCountriesSearchValue}
										loading={isLoading}
										handleLoadMore={handleLoadMoreCountries}
									/>
									<Field
										as={PhoneDialogSelect}
										phoneCodeValue={contactFormVal.phoneCode}
										phoneNumberValue={values.phoneNumber}
										handlePhoneCodeValue={handlePhoneCodeValue}
										phoneNumberName={ContactClaimFormFields.phoneNumber}
										phoneCodeName={ContactClaimFormFields.phoneCode}
										type="object"
										options={countries}
										label={intl.formatMessage({
											id: 'claim.form.contact.information.contact.phone',
										})}
										onInputChange={handleCountriesSearchValue}
										loading={isLoading}
										handleBlurPhoneNumber={handleBlurPhoneNumber}
										handleLoadMore={handleLoadMoreCountries}
									/>
								</FormFieldsContainer>
							</Grid>
							<Grid item xs={12}>
								<NavigationButtons
									isLastStep={true}
									isDisabled={isSubmitting}
								/>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</>
	);
};
