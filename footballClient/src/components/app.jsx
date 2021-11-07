// React Imports
import React, { useEffect, useState } from 'react'
import Select from 'react-select';

// Axios/Setting Axios Import
import api from '../api'

// Import style
import s from './style.module.scss'

// ChakraUI Imports
import {
    Table,
    Tr,
    Th,
    Td,
    Progress
  } from "@chakra-ui/react"


// Styles for React-Select component
const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black'
    }),
}

// It lastTimeoutID so that you can clear the setTimeout() when calling again
let lastTimeoutID

const app = () => {
    // TeamsState - team names and ids. Example object: {value:team_id, label:team_name}. Used in React-Select component
    const [TeamsState, setTeamsState] = useState()

    // TeamState - information about the team, about matches. Example object: 
    // {
        // valueSelect:{value:team_id, label:team_name}, - For React-Select
        // website: team website (String),
        // address: team address (String),
        // phone:  team phone (String),
        // matchesInfo: {
            // goals: count team gouls (Number)
            // countMatches: count team matches (Number)
            // matches: [{ - Array matches
                // enemyTeam: { - Enemy team info
                    // name: enemy team name (String)
                    // id: enemy team id (String)
                // },
                // isWin: team status win or lose (Boolean)
                // isHome: team play at home or not (Boolean)
            // }]
        // }
    // }
    const [TeamState, setTeamState] = useState({
        valueSelect: null
    })

    // LoadingProgress - loading progress. Exmaple object: {progress: progress number (Number), type: loading type, start or end (String)}. The types were created to create an infinite loading effect.
    const [LoadingProgress, setLoadingProgress] = useState({
        progress: 0,
        type: 'start'
    })

    // MessageStae - error messages. Used to output the cooldown api error
    const [MessageState, setMessageState] = useState()

    // Called when the page is loaded for the first time. Here we get a list of teams
    useEffect(() => {

        // Start Loading
        StartLoading()

        // Request to server (http[s]://server_api_link/teams)
        api.get('/teams').then(resp => {
            // Resp is the response data

            // Saving the list of teams
            setTeamsState(resp.data.map(team => {return {value:team.id, label:team.name}}))
            
            // Loading finish
            EndLoading()
        
        // Catch cooldown api error
        }).catch(e => {
            
            // Save message error
            setMessageState('Due to restrictions football-data.org we need to wait a minute. The page will automatically update the information!')

            // Start the timer for 1 minute
            setTimeout(() => {

                // Repeating the request
                api.get('/teams').then(resp => {
                    setTeamsState(resp.data.map(team => {return {value:team.id, label:team.name}}))
                    EndLoading()
                    setMessageState('')
                })
            }, 60000)
        })
    }, [])

    // Called when LoadingProgress changes. Used to call the AnimateProgressBar function again
    useEffect(() => {
        AnimateProgressBar()
    }, [LoadingProgress])

    // AnimateProgressBar function - animation of the progress bar at the top of the screen
    async function AnimateProgressBar() {
        if(LoadingProgress.progress < 30 && LoadingProgress.type === 'start'){
            await new Promise(resolve => setTimeout(() =>{
                setLoadingProgress({...LoadingProgress, progress: LoadingProgress.progress + 2})
            }, 20))
        } else if(LoadingProgress.progress < 100 && LoadingProgress.type === 'end') {
            await new Promise(resolve => setTimeout(() =>{
                setLoadingProgress({...LoadingProgress, progress: LoadingProgress.progress + 2})
            }, 5))
        }
    }

    // Loading start function
    function StartLoading() {
        setLoadingProgress({
            progress: 0,
            type: 'start'
        })
    }

    // Loading finish function
    function EndLoading() {
        setLoadingProgress({...LoadingProgress, progress: 0, type:'end'})
    }

    // Change Team function - called when the team changes. Used to get and save team data. 
    // Incoming Value - {value: team_id, label: team_name}
    function changeTeam(value) {

        // Loading start
        StartLoading()

        // Update info in React-Select
        setTeamState({...TeamsState, valueSelect:value})

        // Request to server (http[s]://server_api_link/team/:teamID)
        api.get(`/team/${value.value}`).then(resp => {
            // Resp is the response data

            // Save team info, matches info
            setTeamState({...TeamState, 
                website: resp.data.teamInfo.website,
                address: resp.data.teamInfo.address,
                phone: resp.data.teamInfo.phone,
                valueSelect:value,
                matchesInfo: resp.data.matchesInfo
            })

            // Loading finish
            EndLoading()

        // Catch cooldown api error
        }).catch(e => {

            // Save message error
            setMessageState('Due to restrictions football-data.org we need to wait a minute. The page will automatically update the information!')

            // Clear setTimeout(). Used to avoid unnecessary requests to the server.
            if(lastTimeoutID) clearTimeout(lastTimeoutID)

            // Start the timer for 1 minute
            lastTimeoutID = setTimeout(() => {

                // Repeating the request
                changeTeam(value)
                setMessageState('')
            }, 60000)
        })
    }
    return (
        <div>
            <div className={s.select}>
                {/* React-Select. This is where the selection of team takes place */}
                <Select
                    styles={customStyles}
                    isLoading={!TeamsState ? true : false}
                    options={TeamsState}
                    placeholder='Select a Team...'
                    value={!TeamState.valueSelect ? 0 : TeamState.valueSelect}
                    onChange={(value) => changeTeam(value)}
                />
            </div>
                {/* Cooldown api error output */}
                {!MessageState ? null : <p style={{textAlign:'center', marginTop:'30px'}}>{MessageState}</p> }

                {/* team info output */}
                {TeamState.website ?
                    <div>
                        <div className={s.team_info}>
                            <p><span>Address:</span> {TeamState.address}</p>
                            <p><span>Phone number:</span> {TeamState.phone}</p>
                            <p><span>Website:</span> <a href={TeamState.website}>{TeamState.website}</a></p>
                            <p><span>Average goals:</span> {!(Number(TeamState.matchesInfo.goals) / Number(TeamState.matchesInfo.countMatches)) ? 0 : (Number(TeamState.matchesInfo.goals) / Number(TeamState.matchesInfo.countMatches)).toFixed(2) }</p>
                            <p><span>Total matches:</span> {TeamState.matchesInfo.countMatches}</p>
                        </div>
                        <div className={s.matches}>
                            <Table>
                                <Tr>
                                    <Th>Opponent Team</Th>
                                    <Th>Status</Th>
                                    <Th>IsHome</Th>
                                </Tr>
                                {TeamState.matchesInfo.matches.map(match => {
                                    return (
                                        <Tr>
                                            <Td><p className={s.enemyTeamName} onClick={() => changeTeam({value: match.enemyTeam.id, label: match.enemyTeam.name})
                                            }>{match.enemyTeam.name}</p></Td>
                                            <Td>{match.isWin ? <p style={{color:'lightgreen'}}>Win</p> : <p style={{color:'red'}}>Lose</p>}</Td>
                                            <Td>{match.isHome ? 'Yes' : 'No'}</Td>
                                        </Tr>
                                    )
                                })}
                            </Table>
                        </div>
                    </div>
                : null}
            
            {/* Chakra Ui progress bar */}
            {LoadingProgress.progress >= 100 ? null : <Progress height='5px' id='progress' hasStripe style={{left:'0', top:'0', width:'100vw'}} position='fixed' isAnimated={true} value={LoadingProgress.progress} />}
        </div>
    )
}

export default app
