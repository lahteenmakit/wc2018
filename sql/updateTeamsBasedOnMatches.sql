UPDATE teams
SET points = 3
FROM matches
WHERE teams.teamName = matches.homeTeam