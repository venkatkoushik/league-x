import { IconButton, Typography } from '@material-ui/core'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Routes } from '../router/routes';
function Players() {
    const location = useLocation()
    const history = useHistory()

    return (
        <div>
            <IconButton onClick={() => history.push(Routes.home)}><ArrowBackIcon style={{ color: "black" }} /></IconButton>
            <Typography variant='h6' align='center'>Picked Player</Typography>
            {location?.state?.map((data) => {
                return (
                    <div style={{ border: "1px solid black", width: "500px", margin: "auto" }}>
                        <Typography variant="caption" >{data?.name}</Typography>
                        <Typography variant="caption" >{data?.event_player_credit ? `credits - ${data?.event_player_credit}` : ""}</Typography>
                    </div>
                )
            })}</div>
    )
}

export default Players