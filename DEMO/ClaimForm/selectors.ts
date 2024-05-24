import type { State } from 'redux-store/Store';

export const selectClaimDestinationFormValues = (state: State) =>
	state.claimDestinationForm;
export const selectClaimDisruptionReasonFormValues = (state: State) =>
	state.claimDisruptionReasonForm;
export const selectClaimAdditionalInfoFormValues = (state: State) =>
	state.claimAdditionalInfoForm;
export const selectClaimContactFormValues = (state: State) =>
	state.claimContactForm;
export const selectFormSteps = (state: State) => state.globalClaimForm.steps;
export const selectClaimFormId = (state: State) =>
	state.globalClaimForm.claimFormId;
export const selectEmail = (state: State) => state.claimContactForm.email;
export const selectCountry = (state: State) => state.claimContactForm.country;
export const selectArrivalAirport = (state: State) =>
	state.claimDestinationForm.destination.arrivalAirport;
export const selectDepartureAirport = (state: State) =>
	state.claimDestinationForm.destination.departureAirport;
