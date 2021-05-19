import React from 'react'
import { Icon } from '@iconify/react-with-api';

export const LiveviewData = (props) => {
	return (
		<div>
			<div>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 10px"}}>
                        <label>Barley</label> <br></br>
                        <progress id="barley" value={props.livedata.ingredients.barley} max="35000"></progress> <br></br>
                        <p>{props.livedata.ingredients.barley}</p>
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Hops</label> <br></br>
                        <progress id="hops" value={props.livedata.ingredients.hops} max="35000"></progress> <br></br>
                        {props.livedata.ingredients.hops}
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Malt</label> <br></br>
                        <progress id="malt" value={props.livedata.ingredients.malt} max="35000"></progress> <br></br>
                        {props.livedata.ingredients.malt}
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Wheat</label> <br></br>
                        <progress id="wheat" value={props.livedata.ingredients.wheat} max="35000"></progress> <br></br>
                        {props.livedata.ingredients.wheat}
                    </div>
                    <div style={{padding: "0px 10px"}}>
                        <label>Yeast</label> <br></br>
                        <progress id="yeast" value={props.livedata.ingredients.yeast} max="35000"></progress> <br></br>
                        {props.livedata.ingredients.yeast}
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="carbon:rain-drop" style={{width: "80px", height: "80px"}}/>
                        <p>Humidity</p>
                        <h1>{Math.round(props.livedata.humidity)}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="ph-vibrate" style={{width: "80px", height: "80px"}}/>
                        <p>Vibration</p>
                        <h1>{Math.round(props.livedata.vibration)}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="fluent:temperature-24-regular" style={{width: "80px", height: "80px"}}/>
                        <p>Temperature</p>
                        <h1>{Math.round(props.livedata.temperature)}</h1>
                    </div>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="cil-speedometer" style={{width: "80px", height: "80px"}}/>
                        <p>Speed</p>
                        <h1>{Math.round(props.livedata.normSpeed)}%</h1>
                    </div>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="mdi-state-machine" style={{width: "80px", height: "80px"}}/>
                        <p>State</p>
                        <h1>{props.livedata.state}</h1>
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="jam-bottle-f" style={{width: "80px", height: "80px"}}/>
                        <p>Beer type</p>
                        <h1>missing data</h1>
                    </div>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="bx-bxs-flag-checkered" style={{width: "80px", height: "80px"}}/> <br></br>
                        <p>Amount to produce</p>
                        <h1>data missing</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="jam-bottle" style={{width: "80px", height: "80px"}}/>
                        <p>Produced</p>
                        <h1>{props.livedata.processed}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="fluent:checkmark-16-regular" style={{width: "80px", height: "80px"}}/>
                        <p>Acceptable</p>
                        <h1>{props.livedata.acceptableProducts}</h1>
                    </div>

                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="akar-icons:cross" style={{width: "80px", height: "80px"}}/>
                        <p>Defect</p>
                        <h1>{props.livedata.defectProducts}</h1>
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 10px"}}>
                        <label>Maintenance</label> <br></br>
                        <progress id="maintenance" style={{width: "680px", height: "40px"}} value={props.livedata.maintenance} max="30000"></progress> <br></br>
                        <p>{(props.livedata.maintenance / 30000 * 100).toFixed(1)}%</p>
                    </div>
                </div>
                <br></br>
                <div style={{display: "inline-flex", align: "center", padding: "10px"}}>
                    <div style={{padding: "0px 25px"}}>
                        <Icon icon="mdi-archive" style={{width: "80px", height: "80px"}}/>
                        <p>Batch id</p>
                        <h1>unknown data</h1>
                    </div>
                </div>
            </div>
		</div>
	);

}