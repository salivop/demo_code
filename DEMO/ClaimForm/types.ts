import { Option } from 'components/FormFields';
import { AirportInterface } from 'features/Airport';

export interface DirectionFormValues {
	purchaseCode: string;
	departureAirport: null | AirportInterface;
	arrivalAirport: null | AirportInterface;
}

export interface DisruptionReasonFormValues {
	userReason: string | null;
	airlineReason: string | null;
	details: string;
}

export interface AdditionalInformationFormValues {
	informed: string | null;
	delayed: string | null;
}

export interface ContactInformationFormValues {
	firstName: string;
	lastName: string;
	birthDate: string;
	email: string;
	repeatEmail: string;
	address: string;
	city: string;
	country: Option | null;
	phoneNumber: string;
	phoneCode: PhoneSelectOption | null;
}

type DestinationAirports = {
		departureAirport: null | AirportInterface;
		arrivalAirport: null | AirportInterface;
}


export interface ClaimSearchStateInterface {
	purchaseCode: string | null;
	destination: DestinationAirports;
}

export interface ClaimSearchAirports {
	destination: DestinationAirports;
}

export interface ClaimDisruptionReasonStateInterface {
	userReason: string | null;
	airlineReason: string | null;
	details: string;
}

export interface AdditionalInformationStateInterface {
	informed: string | null;
	delayed: string | null;
}

export interface ClaimFormStateInterface {
	claimFormId: string | null;
	steps: Record<string, number> | null;
}

export interface ClaimContactFormStateInterface {
	firstName: string;
	lastName: string;
	birthDate: string | null;
	email: string;
	repeatEmail: string;
	address: string;
	city: string;
	country: Option | null;
	phoneNumber: string;
	phoneCode: PhoneSelectOption | null;
}

export enum ClaimFormRoutes {
	Search = 'search',
	DisruptionReason = 'disruption-reason',
	AdditionalInformation = 'additional-information',
	ContactInformation = 'contact-information',
	ClaimCompleted = 'claim-completed',
}

export enum StepNumber {
	Search = 0,
	DisruptionReason = 1,
	AdditionalInformation = 2,
	ContactInformation = 3,
	ClaimCompleted = 4,
}

export enum RootFormRoute {
	Path = '/claim-form',
}

export const NavigateFormRoute: Record<ClaimFormRoutes, string> = {
	[ClaimFormRoutes.Search]: `${RootFormRoute.Path}/${ClaimFormRoutes.Search}`,
	[ClaimFormRoutes.DisruptionReason]: `${RootFormRoute.Path}/${ClaimFormRoutes.DisruptionReason}`,
	[ClaimFormRoutes.AdditionalInformation]: `${RootFormRoute.Path}/${ClaimFormRoutes.AdditionalInformation}`,
	[ClaimFormRoutes.ContactInformation]: `${RootFormRoute.Path}/${ClaimFormRoutes.ContactInformation}`,
	[ClaimFormRoutes.ClaimCompleted]: `${RootFormRoute.Path}/${ClaimFormRoutes.ClaimCompleted}`,
};

export const ClaimFormStepsMap: Record<ClaimFormRoutes, number> = {
	[ClaimFormRoutes.Search]: StepNumber.Search,
	[ClaimFormRoutes.DisruptionReason]: StepNumber.DisruptionReason,
	[ClaimFormRoutes.AdditionalInformation]: StepNumber.AdditionalInformation,
	[ClaimFormRoutes.ContactInformation]: StepNumber.ContactInformation,
	[ClaimFormRoutes.ClaimCompleted]: StepNumber.ClaimCompleted,
};

export interface PhoneSelectOption {
	id: string;
	name: string;
	phoneCode: string;
}

export type ReasonOption = {
	id: string;
	reason: React.ReactNode;
	icon?: string;
};

export type ReasonOptionId = {
	id: string;
};

export interface ClaimEntity {
	id: string;
	contact: {
		address: string;
		city: string;
		country: string;
		countryCode: string;
		email: string;
		firstName: string;
		lastName: string;
		birthDate: string;
		phoneNumber: string;
		phoneCode: string;
	};
	destination: {
		arrivalAirport: string;
		arrivalAirportIataCode: string;
		departureAirportIataCode: string;
		departureAirport: string;
	};
	disruption: {
		userReason: string;
		details: string;
		airlineReason: string;
	};
	flightDetails: {
		delayed: string;
		informed: string;
	};
	purchaseCode: string;
	state: string;
	updatedAt: string;
}

export enum DestinationClaimFormFields {
	purchaseCode = 'purchaseCode',
	departureAirport = 'departureAirport',
	arrivalAirport = 'arrivalAirport',
}

export enum DisruptionClaimFormFields {
	userReason = 'userReason',
	airlineReason = 'airlineReason',
	details = 'details',
}

export enum AdditionalClaimFormFields {
	informed = 'informed',
	delayed = 'delayed',
}

export enum ContactClaimFormFields {
	firstName = 'firstName',
	lastName = 'lastName',
	birthDate = 'birthDate',
	email = 'email',
	repeatEmail = 'repeatEmail',
	address = 'address',
	city = 'city',
	country = 'country',
	phoneNumber = 'phoneNumber',
	phoneCode = 'phoneCode',
}

export interface ClaimSearchStateInterfaceAPI {
	purchaseCode: string | null;
	destination: {
		departureAirport: string;
		departureAirportIataCode: string;
		arrivalAirport: string;
		arrivalAirportIataCode: string;
	};
}

export interface ClaimDisruptionStateInterfaceAPI {
	userReason: string;
	airlineReason: string;
	details: string;
}

export interface ClaimAdditionalStateInterfaceAPI {
	informed: string;
	delayed: string;
}

export interface ClaimContactClaimStateInterfaceAPI {
	firstName: string;
	lastName: string;
	birthDate: string;
	email: string;
	address: string;
	city: string;
	country: string;
	phone: string;
}

export interface ContactFormClaimStateInterfaceAPI {
	firstName: string;
	lastName: string;
	birthDate: string;
	email: string;
	address: string;
	city: string;
	country: string;
	countryCode: string;
	phoneNumber: string;
	phoneCode: string;
}
