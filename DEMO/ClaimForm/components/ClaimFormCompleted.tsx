import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';

import { resetClaimFormStep } from '../reducer/claimFormReducer';
import { selectEmail } from '../selectors';

export const ClaimFormCompleted: React.FC = () => {
	const dispatch = useDispatch();
	const cleanup = () => {
		dispatch(resetClaimFormStep());
	};

	useEffect(() => {
		return () => cleanup();
	}, []);

	const email = useSelector(selectEmail);

	return (
		<Grid container spacing={4} wrap="wrap">
			<Grid item xs={12}>
				<Box display="flex" justifyContent="center">
					<Typography variant="h4">
						<FormattedMessage id="claim.form.get.skyknight.compensation.title" />
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Box display="flex" alignItems="center">
					<CheckCircleIcon
						sx={{ fontSize: '40px', marginRight: '10px' }}
						color="primary"
					/>
					<Typography variant="h5" fontWeight={600}>
						<FormattedMessage id="claim.form.completed.congratulations" />
					</Typography>
				</Box>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					<FormattedMessage id="claim.form.complete.actions.title" />
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<List>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckIcon />
						</ListItemIcon>
						<ListItemText>
							<FormattedMessage id="claim.form.complete.actions.list.check.email" />
						</ListItemText>
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon />
						<Box
							p={2}
							alignItems="center"
							sx={{
								backgroundColor: '#f6f6f6',
								borderRadius: '8px',
							}}
						>
							{email}
						</Box>
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckIcon />
						</ListItemIcon>
						<ListItemText>
							<Typography component="div">
								<FormattedMessage id="claim.form.complete.actions.list.contact.support" />
								<Box
									sx={{ color: 'primary.main' }}
									color="primary"
									fontWeight={700}
									display="inline"
								>
									<FormattedMessage id="skyknight.support.email" />
								</Box>
								.
							</Typography>
						</ListItemText>
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckIcon />
						</ListItemIcon>
						<ListItemText>
							<Typography component="div">
								<FormattedMessage id="claim.form.complete.actions.list.check" />
								<Box
									sx={{ color: 'primary.main' }}
									color="primary"
									fontWeight={700}
									display="inline"
								>
									<FormattedMessage id="claim.form.complete.actions.list.check.spam" />
								</Box>
								<FormattedMessage id="claim.form.complete.actions.list.check.folder" />
							</Typography>
						</ListItemText>
					</ListItem>
				</List>
			</Grid>
		</Grid>
	);
};
