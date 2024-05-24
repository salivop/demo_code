import * as React from 'react';
import { useField, useFormikContext } from 'formik';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FormattedMessage } from 'react-intl';

import { PhoneSelectOption } from '../types';

interface Props {
	phoneCodeName: string;
	phoneCodeValue?: PhoneSelectOption;
	phoneNumberName: string;
	phoneNumberValue: string;
	handlePhoneCodeValue: (option: PhoneSelectOption) => void;
	options: PhoneSelectOption[];
	helperText?: string;
	onInputChange: (value: string) => void;
	loading: boolean;
	handleBlurPhoneNumber: (value: string) => void;
	handleLoadMore: () => void;
}

const phoneCodeOptions = (
	props: React.HTMLAttributes<HTMLLIElement>,
	option: PhoneSelectOption
) => <li {...props}>{`${option.phoneCode} ${option.name}`}</li>;

export const PhoneDialogSelect: React.FC<Props> = ({
	options = [],
	phoneCodeName,
	phoneNumberName,
	phoneCodeValue,
	phoneNumberValue,
	helperText,
	handlePhoneCodeValue,
	onInputChange,
	loading,
	handleBlurPhoneNumber,
	handleLoadMore,
}) => {
	const phoneCode = useField(phoneCodeName);
	const phoneNumber = useField(phoneNumberName);

	const metaCode = phoneCode[1];
	const metaNumber = phoneNumber[1];

	const errorPhoneCode = !!(metaCode && metaCode.touched && metaCode.error);
	const helperPhoneCode = errorPhoneCode ? metaCode.error : helperText;

	const errorPhoneNumber = !!(
		metaNumber &&
		metaNumber.touched &&
		metaNumber.error
	);
	const helperPhoneNumber = errorPhoneNumber ? metaNumber.error : helperText;

	const formikProps = useFormikContext();

	const filterOptions = createFilterOptions({
		stringify: (option: PhoneSelectOption) =>
			`${option.phoneCode} ${option.name}`,
	});

	return (
		<TextField
			size="small"
			error={errorPhoneCode || errorPhoneNumber}
			helperText={helperPhoneCode || helperPhoneNumber}
			variant="outlined"
			type="tel"
			name={phoneNumberName}
			value={phoneNumberValue}
			onChange={(e) =>
				formikProps.setFieldValue(phoneNumberName, e.target.value)
			}
			onBlur={(e) => handleBlurPhoneNumber(e.target.value)}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<Autocomplete
							ListboxProps={{
								role: 'list-box',
								onScroll: (event) => {
									const listboxNode = event.currentTarget;

									if (
										listboxNode.scrollTop + listboxNode.clientHeight ===
										listboxNode.scrollHeight
									) {
										if (handleLoadMore) {
											handleLoadMore();
										}
									}
								},
							}}
							loading={loading}
							filterOptions={filterOptions}
							loadingText={<FormattedMessage id="skyknight.fetching.data" />}
							defaultValue={phoneCodeValue}
							disableClearable
							getOptionLabel={(option: PhoneSelectOption) =>
								option.phoneCode || ''
							}
							onChange={(_, newValue) => {
								handlePhoneCodeValue(newValue);
								formikProps.setFieldValue(phoneCodeName, newValue);
								formikProps.setFieldValue(phoneNumberName, newValue.phoneCode);
							}}
							componentsProps={{
								paper: {
									sx: {
										width: 'max-content',
									},
								},
							}}
							sx={{ width: 115 }}
							disablePortal
							id={phoneNumberName}
							options={options}
							renderOption={(props, option) => phoneCodeOptions(props, option)}
							renderInput={(params) => (
								<TextField
									{...params}
									onChange={(val) =>
										onInputChange && onInputChange(val.target.value)
									}
									placeholder="+123"
									name={phoneCodeName}
									variant="standard"
									InputProps={{
										...params.InputProps,
										disableUnderline: true,
									}}
								/>
							)}
						/>
					</InputAdornment>
				),
			}}
		/>
	);
};
