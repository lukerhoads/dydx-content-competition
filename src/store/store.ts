import { computed, makeObservable, observable } from "mobx";
import { BTC, Market } from "../types/market";

export class Store {
    error: string
    market: Market = BTC
    quoteBalance: number = 0
    leverage: number = 1
    orderSize: number = 0 // negative if short
    assetPrice: number = 10000
    incrementalLeverage: number = 0
    
    constructor() {
        makeObservable(this, {
            error: observable,
            market: observable,
            quoteBalance: observable,
            leverage: observable,
            orderSize: observable,
            assetPrice: observable,
            incrementalLeverage: observable,
            initialMarginRequirement: computed,
            maintenanceMarginRequirement: computed,
            totalAccountValue: computed,
            freeCollateral: computed,
            liquidationPrice: computed,
        })
    }

    get marginFraction() {
        return 1/this.leverage
    }

    get initialMarginRequirement() {
        return Math.abs(this.orderSize * this.assetPrice * this.market.initialMarginFraction)
    }

    get marginRequirement() {
        return Math.abs(this.orderSize * this.assetPrice * this.marginFraction)
    }

    get maintenanceMarginRequirement() {
        return Math.abs(this.orderSize * this.assetPrice * this.market.maintenanceMarginFraction)
    }

    get totalAccountValue() {
        return this.quoteBalance + (this.orderSize * this.assetPrice)
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
        const priceDelta = this.assetPrice * (long ? 1 - mvw : 1 + mvw)
        if (!priceDelta) {
            return 0
        }

        return this.assetPrice + priceDelta
    }

    setMarket(market: Market) {
        this.market = market
    }

    setQuoteBalance(balance: number) {
        this.quoteBalance = balance 
        this.setOrderSize((balance / this.assetPrice) * this.leverage)
    }

    setLeverage(leverage: number) {
        this.leverage = leverage 
        this.setOrderSize((this.quoteBalance / this.assetPrice) * leverage)
    }

    setAssetPrice(assetPrice: number) {
        this.assetPrice = assetPrice 
    }

    setOrderSize(size: number) {
        if (size > this.market.baselinePositionSize) {
            const outstandingSize = size - this.market.baselinePositionSize
            const hitTicks = Math.floor(outstandingSize / this.market.incrementalPositionSize)
            this.incrementalLeverage += (hitTicks * this.market.incrementalMarginFraction)
        } else {
            this.incrementalLeverage = 0
        }

        this.orderSize = size 
    }
}

const store = new Store()
export default store