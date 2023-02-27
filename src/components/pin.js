import { makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { uuid } from 'uuidv4';

const useStyles = makeStyles((theme) => ({
    parentdiv: {
        display: "flex",
        flexDirection: "row",
        marginTop: "25px"
    },
    pin: {
        margin: "5px 5px 5px 0px"
    }
}))

function Pin({
    dynamicstate = {},
    dynamicHandlechange = () => null
}) {
    const classes = useStyles()

    return (
        <div className={classes.parentdiv}>
            {
                Object.keys(dynamicstate).map((v) => {
                    return (
                        <TextField size="small" variant='outlined' className={classes.pin} type="password" maxLength={1} value={dynamicstate?.[v]?.value} onChange={(e) => dynamicHandlechange(e, v)} />

                    )
                })
            }

        </div>
    )
}

export default Pin