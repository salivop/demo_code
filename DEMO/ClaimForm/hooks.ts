import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ClaimEntity, ReasonOption } from './types';
import { useIntl, IntlShape } from 'react-intl';

import { selectLocale } from 'features/LanguageSelector';
import { http } from 'core/ApiClient';
import { Error, HttpCodes } from 'core/types';
import { Routes } from 'types/types';
import { resolveApiErrors } from 'features/ApiErrors';
import { setClaimFormId } from './reducer/claimFormReducer';
import {
	AirportInterface,
	AirportsListAPI,
	setAirports,
} from 'features/Airport';
import { AppDispatch } from 'redux-store/Store';
import { useAppDispatch } from 'redux-store/hooks';

import { initDisruptionReason } from './reducer/disruptionReasonReducer';
import { initAdditionalInfo } from './reducer/additionalInfoReducer';
import {
	initDestination,
	setPurchaseId,
} from './reducer/destinationClaimReducer';
import { setContactDetailsForm } from './reducer/contactInfoReducer';
import {
	userDisruptionReasons,
	airlineDisruptionReasons,
	informedReason,
	delayedReason,
} from './constants';
import { ListPaginationConfig } from 'core/constants';

const initClaimForm = (
	initData: ClaimEntity | undefined,
	dispatch: AppDispatch,
	intl: IntlShape
) => {
	if (!initData) return;

	const getOption = (
		optionText: string,
		options: Record<string, ReasonOption>
	) => {
		const optionKey = Object.keys(options).filter((key) => {
			if (options[key].reason === optionText) {
				return options[key];
			}
		});
		if (optionKey) {
			return options[optionKey[0]];
		} else return null;
	};

	const userReason =
		getOption(initData.disruption.userReason, userDisruptionReasons(intl))
			?.id || null;

	const airlineReason =
		getOption(initData.disruption.airlineReason, airlineDisruptionReasons(intl))
			?.id || null;

	dispatch(
		initDisruptionReason({
			userReason,
			airlineReason,
			details: initData.disruption.details,
		})
	);

	const informed =
		getOption(initData.flightDetails.informed, informedReason(intl))?.id ||
		null;
	const delayed =
		getOption(initData.flightDetails.delayed, delayedReason(intl))?.id || null;
	dispatch(initAdditionalInfo({ informed, delayed }));
	dispatch(setPurchaseId(initData.purchaseCode));

	dispatch(
		setContactDetailsForm({
			firstName: initData.contact.firstName,
			lastName: initData.contact.lastName,
			birthDate: initData.contact.birthDate,
			email: initData.contact.email,
			repeatEmail: initData.contact.email,
			address: initData.contact.address,
			city: initData.contact.city,
			country: {
				id: initData.contact.countryCode,
				name: initData.contact.country,
			},

			phoneNumber: initData.contact.phoneNumber,
			phoneCode: {
				id: initData.contact.phoneCode,
				name: initData.contact.country,
				phoneCode: initData.contact.phoneCode,
			},
		})
	);
};

export const useInitializeClaimEntity = (entityId: string | null) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Record<string, string> | null>(null);
	const [, setSearchParams] = useSearchParams();

	const dispatch = useAppDispatch();
	const locale = useSelector(selectLocale);
	const intl = useIntl();

	const fetchClaimEntity = async (id: string | null) => {
		if (!id) return;
		return http.get<ClaimEntity>(`${Routes.Claims}/${id}`);
	};

	const fetchAirports = async () =>
		http.get<AirportsListAPI>(
			Routes.Airports,
			ListPaginationConfig
		);

	const fetchSelectedAirports = async (iataCode: string) =>
		http.get<AirportInterface[]>(`${Routes.Airports}?search=${iataCode}`);

	const fetchData = async () => {
		setError(null);

		await Promise.all([fetchClaimEntity(entityId), fetchAirports()])
			.then((res) => {
				initClaimForm(res[0], dispatch, intl);

				dispatch(setAirports(res[1].data));
				dispatch(setClaimFormId(entityId));
				if (
					res[0]?.destination.arrivalAirportIataCode !== '' &&
					res[0]?.destination.departureAirportIataCode
				) {
					return Promise.all([
						fetchSelectedAirports(
							res[0]?.destination.arrivalAirportIataCode || ''
						),
						fetchSelectedAirports(
							res[0]?.destination.departureAirportIataCode || ''
						),
					]);
				}
				return;
			})
			.then((airports) => {
				if (airports) {
					dispatch(
						initDestination({
							destination: {
								arrivalAirport: airports[0][0],
								departureAirport: airports[1][0],
							},
						})
					);
				}
			})
			.catch((e: Error) => {
				if (e.cause.statusCode === HttpCodes.NotFound) {
					setSearchParams('');
					dispatch(setClaimFormId(null));
				}
				setError(resolveApiErrors(e.cause.violations, {}, locale).globalErrors);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchData().catch((e: Error) =>
			setError(resolveApiErrors(e.cause.violations, {}, locale).globalErrors)
		);
	}, []);

	return { isLoading, error };
};
