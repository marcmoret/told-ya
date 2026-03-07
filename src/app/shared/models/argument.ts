export type VoteSide = 'A' | 'B';
export type VoteCountKey = 'votesA' | 'votesB';
export type VoterFlagKey = `voter${number}`;

export interface Argument {
  id?: string;
  topic: string;
  personA: string;
  personB: string;
  argumentA: string;
  argumentB: string;
  votesA: number;
  votesB: number;
  numbers: string[];
  shareMessageTemplate: string;
  createdDate: Date;
  [key: VoterFlagKey]: boolean | undefined;
}

export type ArgumentDraft = Omit<Argument, 'id'>;

export function getVoterKey(voterId: string): VoterFlagKey {
  return `voter${voterId}` as VoterFlagKey;
}

export function getVoteCountKey(side: VoteSide): VoteCountKey {
  return side === 'A' ? 'votesA' : 'votesB';
}

export function getTotalVotes(argument: Pick<Argument, VoteCountKey>): number {
  return argument.votesA + argument.votesB;
}

export function isValidVoterId(
  argument: Pick<Argument, 'numbers'>,
  voterId: string
): boolean {
  if (!/^\d+$/.test(voterId)) {
    return false;
  }

  if (voterId === '0') {
    return true;
  }

  const numericVoterId = Number(voterId);
  return numericVoterId >= 1 && numericVoterId <= argument.numbers.length;
}
