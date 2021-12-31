import { makeAutoObservable } from "mobx";
import { BTC, Market } from "../types/market";

export class Store {
    market: Market = BTC
    quoteBalance: number = 0
    leverage: number = 1
    orderSize: number = 0 // negative if short
    assetPrice: number = 0
    incrementalLeverage: number = 0
    
    constructor() {
        makeAutoObservable(this)
    }

    get initialMarginRequirement() {
        return Math.abs(this.orderSize * this.assetPrice * this.market.initialMarginFraction)
    }

    get maintenanceMarginRequirement() {
        return Math.abs(this.orderSize * this.assetPrice * this.market.maintenanceMarginFraction)
    }

    get totalAccountValue() {
        return this.initialMarginRequirement + (this.orderSize * this.assetPrice)
    }

    get freeCollateral() {
        return this.totalAccountValue - this.initialMarginRequirement
    }

    get liquidationPrice() {
        if (!this.maintenanceMarginRequirement) {
            return 0
        }

        const long = this.orderSize > 0
        const mvw = (this.market.maintenanceMarginFraction * this.totalAccountValue) / this.maintenanceMarginRequirement
        return this.assetPrice * (long ? 1 - mvw : 1 + mvw)
    }

    setMarket(market: Market) {
        this.market = market
    }

    setQuoteBalance(balance: number) {
        this.quoteBalance = balance 
    }

    setLeverage(leverage: number) {
        this.leverage = leverage 
    }

    setAssetPrice(assetPrice: number) {
        this.assetPrice = assetPrice 
    }

    setOrderSize(size: number) {
        if (size > this.market.maximumPositionSize) {
            throw new Error(`Maximum position size for asset ${this.market.name} reached`)
        }

        if (size > this.market.baselinePositionSize) {
            const outstandingSize = size - this.market.baselinePositionSize
            const hitTicks = Math.floor(outstandingSize / this.market.incrementalPositionSize)
            this.incrementalLeverage += (hitTicks * this.market.incrementalMarginFraction)
        }

        this.orderSize = size 
    }
}

const store = new Store()
export default store