import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { Option } from 'components/FormFields';
import { ClaimContactFormStateInterface, PhoneSelectOption } from '../types';

const initialState: ClaimContactFormStateInterface = {
	firstName: '',
	lastName: '',
	birthDate: null,
	email: '',
	repeatEmail: '',
	address: '',
	city: '',
	country: null,
	phoneCode: null,
	phoneNumber: '',
};

export const claimContactFormSlice = createSlice({
	name: 'claimContactForm',
	initialState,
	reducers: {
		setCountry: (
			state: ClaimContactFormStateInterface,
			action: PayloadAction<Option | null>
		) => {
			state.country = action.payload;
		},
		setPhoneCode: (
			state: ClaimContactFormStateInterface,
			action: PayloadAction<PhoneSelectOption | null>
		) => {
			state.phoneCode = action.payload;
		},
		setBirthDate: (
			state: ClaimContactFormStateInterface,
			action: PayloadAction<string>
		) => {
			state.birthDate = action.payload;
		},
		setContactDetailsForm: (
			_state: ClaimContactFormStateInterface,
			action: PayloadAction<ClaimContactFormStateInterface>
		) => action.payload,
		setContactPhoneNumber: (
			state: ClaimContactFormStateInterface,
			action: PayloadAction<string>
		) => {
			state.phoneNumber = action.payload;
		},
	},
});

export const {
	setCountry,
	setContactDetailsForm,
	setBirthDate,
	setPhoneCode,
	setContactPhoneNumber,
} = claimContactFormSlice.actions;

export default claimContactFormSlice.reducer;
