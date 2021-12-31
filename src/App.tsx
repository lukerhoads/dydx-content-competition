import React, { useEffect } from 'react'
import { Input } from './components/Input/Input'
import { Slider } from './components/Slider/Slider'
import './scss/app.scss'

import { observer } from 'mobx-react'
import { Store } from './store/store'
import { BTC, ETH } from './types/market'
// import { DydxClient } from '@dydxprotocol/v3-client'
import Public from '@dydxprotocol/v3-client/src/modules/public'
// Will retrieve latest price according to websocket

const dydxPublic = new Public("https://api.dydx.exchange")
// const dydxPublic = new DydxClient("https://api.dydx.exchange").public

// Fields for:
// - Asset (BTC or ETH supported right now)
// - Collateral (usdc)
// - Leverage (1x-25x) (up to 10x for most)
// - Order size
// - Add price volatity of asset over last 30 days

export const App = observer(({ store }: { store: Store }) => {
    const marketKey = `${store.market.name}-USD`
    // const dydxPublic = useMemo(() => {
    //     return new DydxClient("https://api.dydx.exchange").public
    // }, [])

    useEffect(() => {
        let oraclePrice: number
        const fetchOraclePrice = async () => {
            const market = await dydxPublic.getMarkets(store.market.market)
            oraclePrice = Number(market.markets[marketKey].oraclePrice)
        }
        store.setAssetPrice(oraclePrice)
        const interval = setInterval(async () => {
            const market = await dydxPublic.getMarkets(store.market.market)
            store.setAssetPrice(Number(market.markets[marketKey].oraclePrice))
        }, 10000);
        return () => clearInterval(interval);
    }, []);

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
        console.log(store.initialMarginRequirement)
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
                            label='Order Size'
                            placeholder='0.00'
                            value={store.orderSize.toString()}
                            onChange={onOrderSizeChange}
                            />
                    </div>
                    <div className="results">
                        <h3>Adjusted leverage: {store.leverage + store.incrementalLeverage}x</h3>
                        <h3>Initial Margin Requirement: ${store.initialMarginRequirement}</h3>
                        <h3>Maintenance Margin Requirement: ${store.maintenanceMarginRequirement}</h3>
                        <h3>Total Account Value: ${store.totalAccountValue}</h3>
                        <h3>Free Collateral: ${store.freeCollateral}</h3>
                        <h3>Liquidation price: ${store.liquidationPrice}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
})