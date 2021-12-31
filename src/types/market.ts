
// https://github.com/dydxprotocol/starkex-lib/blob/master/src/types.ts
export enum DydxMarket {
    BTC_USD = 'BTC-USD',
    ETH_USD = 'ETH-USD',
    LINK_USD = 'LINK-USD',
    AAVE_USD = 'AAVE-USD',
    UNI_USD = 'UNI-USD',
    SUSHI_USD = 'SUSHI-USD',
    SOL_USD = 'SOL-USD',
    YFI_USD = 'YFI-USD',
    ONEINCH_USD = '1INCH-USD',
    AVAX_USD = 'AVAX-USD',
    SNX_USD = 'SNX-USD',
    CRV_USD = 'CRV-USD',
    UMA_USD = 'UMA-USD',
    DOT_USD = 'DOT-USD',
    DOGE_USD = 'DOGE-USD',
    MATIC_USD = 'MATIC-USD',
    MKR_USD = 'MKR-USD',
    FIL_USD = 'FIL-USD',
    ADA_USD = 'ADA-USD',
    ATOM_USD = 'ATOM-USD',
    COMP_USD = 'COMP-USD',
    BCH_USD = 'BCH-USD',
    LTC_USD = 'LTC-USD',
    EOS_USD = 'EOS-USD',
    ALGO_USD = 'ALGO-USD',
    ZRX_USD = 'ZRX-USD',
    XMR_USD = 'XMR-USD',
    ZEC_USD = 'ZEC-USD',
    ENJ_USD = 'ENJ-USD',
    ETC_USD = 'ETC-USD',
    XLM_USD = 'XLM-USD',
    TRX_USD = 'TRX-USD',
    XTZ_USD = 'XTZ-USD',
    HNT_USD = 'HNT-USD',
  }

export interface Market {
    name: string
    market: DydxMarket
    initialMarginFraction: number 
    maintenanceMarginFraction: number 
    
    baselinePositionSize: number 
    incrementalPositionSize: number 
    maximumPositionSize: number 
    incrementalMarginFraction: number
}

export const BTC: Market = {
    name: 'BTC',
    market: DydxMarket.BTC_USD,
    initialMarginFraction: 1/25,
    maintenanceMarginFraction: 3/100,
    baselinePositionSize: 9,
    incrementalPositionSize: 1.5,
    maximumPositionSize: 170,
    incrementalMarginFraction: 0.01,
}

export const ETH: Market = {
    name: 'ETH',
    market: DydxMarket.ETH_USD,
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