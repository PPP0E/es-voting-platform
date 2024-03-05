export function isVotingRunning(selectedElection) {
	if (!selectedElection) return false;
	const isElectionCurrent = selectedElection.is_current;
	const isElectionVisible = selectedElection.is_visible;
	const areTheResultsPublished = selectedElection.publish_results;
	const isVotingForceEnabled = selectedElection.forceEnabled;

	if (!isElectionCurrent) return false;
	if (areTheResultsPublished) return false;
	if (!isElectionVisible) return false;
	if (isVotingForceEnabled) return true;

	const startAndEndDateSet = selectedElection.voting_start_date && selectedElection.voting_end_date;
	if (!startAndEndDateSet) return false;

	const automaticVotingEnabled = selectedElection.autoEnabled;
	if (!automaticVotingEnabled) return false;

	const currentTime = new Date();
	const electionAutoStartTime = new Date(selectedElection.voting_start_date);
	const electionAutoEndTime = new Date(selectedElection.voting_end_date);

	const isCurrentlyAutoVotingTimeFrame = currentTime >= electionAutoStartTime && currentTime <= electionAutoEndTime;
	if (isCurrentlyAutoVotingTimeFrame) return true;
	return false;
}

/* function isVotingRunning(selectedElection) {
   const isElectionCurrent = selectedElection.is_current;
   const isElectionVisible = selectedElection.is_visible;
   const areTheResultsPublished = selectedElection.publish_results;
   const isVotingForceEnabled = selectedElection.forceEnabled;
   const automaticVotingEnabled = selectedElection.autoEnabled;
   const currentTime = new Date();
   const electionAutoStartTime = new Date(selectedElection.voting_start_date);
   const electionAutoEndTime = new Date(selectedElection.voting_end_date);
   const startAndEndDateSet = selectedElection.voting_start_date && selectedElection.voting_end_date;
   const isCurrentlyAutoVotingTimeFrame = currentTime >= electionAutoStartTime && currentTime <= electionAutoEndTime;

   return isElectionVisible && !areTheResultsPublished && isElectionCurrent && (isVotingForceEnabled || (startAndEndDateSet && automaticVotingEnabled && isCurrentlyAutoVotingTimeFrame));
} */
