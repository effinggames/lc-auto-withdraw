import * as Assert from 'assert';

export const LendingClubEmail = process.env.LENDING_CLUB_EMAIL;
Assert.ok(LendingClubEmail);
export const LendingClubPassword = process.env.LENDING_CLUB_PASSWORD;
Assert.ok(LendingClubPassword);

