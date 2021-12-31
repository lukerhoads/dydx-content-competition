export interface Market {
    name: string
    initialMarginFraction: number 
    maintenanceMarginFraction: number 
    
    baselinePositionSize: number 
    incrementalPositionSize: number 
    maximumPositionSize: number 
    incrementalMarginFraction: number
}

export const BTC: Market = {
    name: 'BTC',
    initialMarginFraction: 1/25,
    maintenanceMarginFraction: 3/100,
    baselinePositionSize: 9,
    incrementalPositionSize: 1.5,
    maximumPositionSize: 170,
    incrementalMarginFraction: 0.01,
}

export const ETH: Market = {
    name: 'ETH',
    initialMarginFraction: 1/25,
    maintenanceMarginFraction: 3/100,
    baselinePositionSize: 140,
    incrementalPositionSize: 28,
    maximumPositionSize: 2820,
    incrementalMarginFraction: 0.01,
}

export const Markets: { [marketName: string]: Market } = {
    BTC: BTC,
    ETH: ETH
}