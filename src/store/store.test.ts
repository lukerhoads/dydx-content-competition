import { Store } from './store'

describe('store', () => {
    const testStore = new Store()
    testStore.setAssetPrice(10000)
    testStore.setQuoteBalance(400)
    testStore.setOrderSize(1)
    testStore.setLeverage(25)
    it('store updates parameters correctly', () => {
        expect(testStore.initialMarginRequirement).toBe(400)
        expect(testStore.maintenanceMarginRequirement).toBe(300)
        expect(testStore.totalAccountValue).toBe(10400)
    })
    
    const testStore2 = new Store()
    testStore2.setAssetPrice(10000)
    testStore2.setQuoteBalance(400)
    testStore2.setOrderSize(-1)
    testStore2.setLeverage(25)
    it('store updates parameters correctly with adverse inputs', () => {
        expect(testStore2.initialMarginRequirement).toBe(400)
        expect(testStore2.maintenanceMarginRequirement).toBe(300)
        expect(testStore2.totalAccountValue).toBe(-9600)
    })
})
