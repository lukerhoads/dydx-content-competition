import React, { useState } from "react";
import './Slider.scss'

export interface SliderProps {
    label?: string
    value: number
    min: number 
    max: number 
    step?: number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Slider = (props: SliderProps) => {
    // const defaultValue = (props.min + props.max) / 2
    // const [value, setValue] = useState(props.value ? props.value : defaultValue)

    // const valueBoxStyle = { left: `${(props.value / props.max) * 100}%` }

    return (
        <div className="slider-container">
            <span>
                {props.label ? (
                    <p className='primary'>{props.label}</p>
                ): null}
                {props.value}x
            </span>
            <div className="range-container">
                <input
                    type="range" 
                    min={`${props.min}`} 
                    max={`${props.max}`}
                    // defaultValue={`${defaultValue}`}
                    step={`${props.step}`} 
                    value={props.value} 
                    className="slider" 
                    onChange={e => props.onChange(e)}
                    />
                {/* <div className="range-value" style={valueBoxStyle}>
                    ${props.value}x
                </div> */}
            </div>
        </div>
    )
}