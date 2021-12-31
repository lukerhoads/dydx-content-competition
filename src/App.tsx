import React, { useEffect, useState } from 'react'
import { Input } from './components/Input/Input'
import { Slider } from './components/Slider/Slider'
import './scss/app.scss'

import { observer } from 'mobx-react'
import { Store } from './store/store'
import { BTC, ETH } from './types/market'
// import { DydxClient } from '@dydxprotocol/v3-client'
// import Public from '@dydxprotocol/v3-client/src/modules/public'
// Will retrieve latest price according to websocket
import Dydx from './adapters/dydx'

const dydxPublic = new Dydx("https://api.dydx.exchange")
// const dydxPublic = new Public("https://api.dydx.exchange")
// const dydxPublic = new DydxClient("https://api.dydx.exchange").public

// Fields for:
// - Asset (BTC or ETH supported right now)
// - Collateral (usdc)
// - Leverage (1x-25x) (up to 10x for most)
// - Order size
// - Add price volatity of asset over last 30 days

export const App = observer(({ store }: { store: Store }) => {
    const [error, setError] = useState("")
    const [priceLoading, setPriceLoading] = useState(true)
    const [oraclePrice, setOraclePrice] = useState(store.assetPrice)
    const marketKey = `${store.market.name}-USD`
    // const dydxPublic = useMemo(() => {
    //     return new DydxClient("https://api.dydx.exchange").public
    // }, [])

    const fetchOraclePrice = async () => {
        const market = await dydxPublic.getMarkets(store.market.market)
        const price = Number(market.markets[marketKey].oraclePrice)
        store.setAssetPrice(price)
        setOraclePrice(price)
    }

    useEffect(() => {
        fetchOraclePrice()
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            await fetchOraclePrice()
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const onAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'BTC') {
            store.setMarket(BTC)
        }

        if (e.target.value === 'ETH') {
            console.log("Setting eth")
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
        console.log(parseInt('-25512'))
        console.log(e.target.value)
        const parsed = parseInt(e.target.value)
        if (Math.abs(parsed) > store.market.maximumPositionSize) {
            setError(`Maximum position size of ${store.market.maximumPositionSize} for ${store.market.name} reached`)
        } else {
            setError('')
        }
        store.setOrderSize(parsed)
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
                            value={store.leverage}
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
                            label='Order Size (negative if short)'
                            placeholder='0.00'
                            value={store.orderSize.toString()}
                            onChange={onOrderSizeChange}
                            />
                        <span className="error">{error}</span>
                        <span>{priceLoading ? 'Price loading' : ''}</span>
                    </div>
                    <div className="results">
                        <p>Current {store.market.name} perp price: <b>${oraclePrice}</b></p>
                        <p>Adjusted leverage: <b>{store.leverage + store.incrementalLeverage}x</b></p>
                        <p>Initial Margin Requirement: <b>${store.initialMarginRequirement}</b></p>
                        {/* <p>Margin Requirement: <b>${store.marginRequirement}</b></p> */}
                        <p>Maintenance Margin Requirement: <b>${store.maintenanceMarginRequirement}</b></p>
                        <p>Total Account Value: <b>${store.totalAccountValue}</b></p>
                        <p>Free Collateral: <b>${store.freeCollateral}</b></p>
                        <p>Liquidation price: <b>${store.liquidationPrice}</b></p>
                    </div>
                </div>
            </div>
        </div>
    )
})