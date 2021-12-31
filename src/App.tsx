import React from 'react'
import { Input } from './components/Input/Input'
import { Slider } from './components/Slider/Slider'
import './scss/app.scss'

import { observer } from 'mobx-react'
import { Store } from './store/store'
import { BTC, ETH } from './types/market'

// Will retrieve latest price according to websocket

// Fields for:
// - Asset (BTC or ETH supported right now)
// - Collateral (usdc)
// - Leverage (1x-25x) (up to 10x for most)
// - Order size

export const App = observer(({ store }: { store: Store }) => {
    const onAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Fetch price from oracle, set store to new market

        if (e.target.value === 'BTC') {
            store.setMarket(BTC)
        }

        if (e.target.value === 'ETH') {
            store.setMarket(ETH)
        }
    }

    const onCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.setQuoteBalance(Number(e.target.value))
    }

    const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.setLeverage(Number(e.target.value))
    }

    const onOrderSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.setOrderSize(Number(e.target.value))
    }

    const maxMargin = 1/store.market.initialMarginFraction
    
    return (
        <div className="main">
            <div className="board">
                <div className="header">
                    <div className="image-container">
                        <img src="/images/logo.svg" className="logo" />
                    </div>
                    <div className="title-container">
                        <h1 className="title">Risk Panel</h1>
                    </div>
                </div>
                <div className="main-board">
                    <div className="adjustments">
                        <select name="market" onChange={(e) => onAssetChange(e)}>
                            <option value="btc">BTC</option>
                            <option value="eth">ETH</option>
                        </select>
                        <Slider 
                            label='Leverage'
                            value={1}
                            min={1}
                            max={maxMargin}
                            step={1}
                            onChange={onSliderChange}
                            />
                        <Input
                            label='Collateral'
                            placeholder='in (USDC)'
                            value={store.quoteBalance.toString()}
                            onChange={onCollateralChange}
                            />
                        <Input
                            label='Order Size'
                            placeholder='0.00'
                            value={store.orderSize.toString()}
                            onChange={onOrderSizeChange}
                            />
                    </div>
                    <div className="results">
                        <h2>Adjusted leverage: {store.leverage + store.incrementalLeverage}x</h2>
                        <h2>Initial Margin Requirement: ${store.initialMarginRequirement}</h2>
                        <h2>Maintenance Margin Requirement: ${store.maintenanceMarginRequirement}</h2>
                        <h2>Total Account Value: ${store.totalAccountValue}</h2>
                        <h2>Free Collateral: ${store.freeCollateral}</h2>
                        <h2>Liquidation price: ${store.assetPrice + store.liquidationPrice}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
})