import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { uuid } from 'uuidv4';
import Pin from '../../components/pin';

const useStyles = makeStyles((theme) => ({
    parentdiv: {

    },
    pin: {
        margin: "5px"
    },
    btn: {
        color: "white",
        margin: "3px",
        width: "50px",
        height: "30px"
    }
}))
function Home() {
    const classes = useStyles()
    const [numberofinput, setNumberofInputs] = useState()
    const [dynamicstate, setDynamicstate] = useState({})

    const [error, setError] = useState({
        error: false,
        errortext: ""
    })

    const dynamicHandlechange = (event, value) => {
        let inputvalue = event.target.value
        setDynamicstate({ ...dynamicstate, [value]: { ...dynamicstate[value], value: inputvalue } })
    }
    const handlechangeofinput = (e) => {
        if (e.target.value <= 6) {
            setDynamicstate({})
            setError({ ...error, error: false, errortext: "" })
            setNumberofInputs(e.target.value)
        }
        else {
            setError({ ...error, error: true, errortext: "Input must be less than 6" })
        }
    }



    const submit = () => {
        let wholeschema = {}
        for (let i = 1; i <= numberofinput; i++) {
            let id = uuid()
            let schema = {
                id: id,
                value: ""
            }
            wholeschema = { ...wholeschema, [id]: schema }
        }
        setDynamicstate({ ...wholeschema })
    }

    console.log({ dynamicstate })
    return (
        <div style={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "400px" }}>
                <div style={{ display: "flex", gap: "10px" }} >
                    <TextField
                        type="number"
                        size='small'
                        label="Number of pins"
                        variant='outlined'
                        value={numberofinput}
                        onChange={handlechangeofinput}
                        error={error.error}
                        helperText={error.errortext} />
                    <Button
                        variant='contained'
                        className={classes.btn}
                        color="primary"
                        size="small"
                        onClick={submit}
                    >Submit</Button>
                </div>

                <Pin numberofinput={numberofinput} dynamicstate={dynamicstate} dynamicHandlechange={dynamicHandlechange} />
            </div>
        </div >
    )
}

export default Home