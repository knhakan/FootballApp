# Football API application  

A simple repository to fetch data from an api.   
The project contains both Backend written in NodeJs and frontend written in ReactJs.  

## Getting started  

To install the project, you need to run the following commands both for backend and for frontend  

1. Install packages:     
npm  -> run the command: *npm install*  
yarn -> run the command: *yarn*  

2. Run:     
npm  -> run the command: *npm run start-d*  
yarn -> run the command: *yarn run start-d*  

## APIs  

/teams  
•	Request to https://api.football-data.org/v2/teams  
•	Error Handling  
•	Fetch data  
•	Returns: Array  
Returned Array:   
*[{  id: team id (Number)  
     name: team name (String)  
}]*  

/team/:teamID  
•	Request to https://api.football-data.org/v2/teams/:teamID  
•	Error Handling  
•	Fetch team info  
•	Request to https://api.football-data.org/v2//teams/:teamID/matches  
•	Error Handling  
•	Fetch matches info  
•	Returns: Object  
Returned Object:  
 *{  
teamInfo: {  
website: team website, (String)  
address: team address, (String)  
phone: team phone (String)  
},  
matchesInfo: {  
	goals: count team goals (Number)  
	countMatches: count team matches (Number)  
	matches: [{ - Array  
		isHome: team play at home or not (Boolean)  
		isWin: team status win or lose (Boolean)  
		opponentTeam: opponent team name (String)  
	}]}}*  

