import React, { useState } from 'react'
import "./Input.scss"

export interface InputProps {
    label?: string
    placeholder: string
    value: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = (props: InputProps) => {
    return (
        <div className="full-input">
            {props.label ? (
                <p className='primary'>{props.label}</p>
            ): null}
            <div className="input-wrapper">
                <input 
                    type="text"
                    className='input'
                    value={props.value}
                    placeholder={props.placeholder}
                    onChange={e => props.onChange(e)}
                    onKeyPress={e => console.log("key")} 
                    />
            </div>
        </div>
    )
}