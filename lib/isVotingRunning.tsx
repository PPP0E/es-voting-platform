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

	const startAndEndDateSet = selectedElection.voting_start_time && selectedElection.voting_end_time;
	if (!startAndEndDateSet) return false;

	const automaticVotingEnabled = selectedElection.autoEnabled;
	if (!automaticVotingEnabled) return false;

	const currentTime = new Date();
	//voting_start_time is in format HH:MM, voting end time is in format HH:MM, election_date is in format YYYY-MM-DD
	//electionAutoStartTime and electionAutoEndTime are in format YYYY-MM-DDTHH:MM:SSZ the date portion of both is the same as election_date
	const electionAutoStartTime = new Date(selectedElection.election_date + "T" + selectedElection.voting_start_time);
	const electionAutoEndTime = new Date(selectedElection.election_date + "T" + selectedElection.voting_end_time);
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
