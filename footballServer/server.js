// Express import
const express = require('express')

// Cors import
const cors = require('cors')

// Request import
var request = require('request');

// The port on which the server will start
const port =  5050

// Link on api.football-data.org
const API_FOOTBALL = 'https://api.football-data.org/v2'

// Options for requesting to api.football-data.org
const options = {
    method: 'GET',
    headers:{
        // You can register on football-data.org and use your token or leave everything and use mine
        'X-Auth-Token': '7cb10c319f1d4d5680158a514e06ae94',
    },
}

const app = express()

// Setting cors
app.use(cors({
    origin: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}))

app.use(express.json())


// Read API.docx
app.get('/team/:teamID', (req, res)=>{
    request({
        ...options, 
        uri: `${API_FOOTBALL}/teams/${req.params.teamID}/`
    },  (error, response, body) => {
        let data = JSON.parse(body)
        if(data.errorCode) return res.status(500).json('api cooldown')
        let teamInfo = {
            website: data.website,
            address: data.address,
            phone: data.phone
        }
        request({
            ...options, 
            // uri: `${API_FOOTBALL}/teams/65/matches`
            uri: `${API_FOOTBALL}/teams/${req.params.teamID}/matches`
        },  (error, response, body) => {
            let data = JSON.parse(body)
            if(data.errorCode) return res.status(500).json('api cooldown')
            let countMatches = 0
            let countGoals = 0
            let matchesInfo = {
                matches: data.matches.filter(match => {
                    if(match.status === 'FINISHED' && match.competition.name === 'Premier League') return true
                    else return false
                }).map(match => {
                    let isWin, isHome, enemyTeam
                    countMatches++;
                    if(Number(match.homeTeam.id) === Number(req.params.teamID)) {
                        isHome = true
                        countGoals += match.score.fullTime.homeTeam
                        enemyTeam = {
                            name: match.awayTeam.name,
                            id: match.awayTeam.id
                        }
                    } else {
                        isHome = false
                        countGoals += match.score.fullTime.awayTeam
                        enemyTeam = {
                            name: match.homeTeam.name,
                            id: match.homeTeam.id
                        }
                    }
                    if(match.score.winner === 'AWAY_TEAM' && !isHome) {
                        isWin = true
                    }else if(match.score.winner === 'HOME_TEAM' && isHome) {
                        isWin = true
                    } else {
                        isWin = false
                    }
                    return {isHome, isWin, enemyTeam}
                }),
                goals: countGoals,
                countMatches: countMatches
            }
            return res.status(200).json({teamInfo, matchesInfo})
        })
        
    })   
})

// Read API.docx
app.get('/teams', (req, res)=>{
    request({
        ...options, 
        uri: `${API_FOOTBALL}/teams`
    },  (error, response, body) => {
        if(JSON.parse(body).errorCode) return res.status(500).json('api cooldown')
        let teams = []
        JSON.parse(body).teams.forEach(team => {
            teams.push({
                id: team.id,
                name: team.name
            })
        })
        return res.status(200).json(teams)
    })
})

// Start server
const start = async () => {
    try {
        app.listen(port, ()=> {
            console.log(`server start on http://localhost:${port}/`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

module.exports.app = app;