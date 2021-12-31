# DYDX Risk Calculator

Risk calculator for https://dydx.exchange built in React. DO NOT expect anything to work.

## Details
- Font: Inter
- Background color: #1c1c28
- Purple color: #6669ff

# How to use
- Clone
- Yarn/npm install
- Yarn/npm start
- view localhost:3000

## Resources used:
- https://help.dydx.exchange/en/articles/5232637-maximum-position-sizes
- https://help.dydx.exchange/en/articles/5108506-understanding-details-of-the-market
- https://help.dydx.exchange/en/articles/4797405-how-does-cross-margining-work-on-perpetuals
- https://help.dydx.exchange/en/articles/4800587-l2-perpetual-contract-specs
- https://help.ftx.com/hc/en-us/articles/360027946371-Margin-Collateral

## Formulas used:
(Margin)[https://docs.dydx.exchange/#margin]
S = order size (negative if short)
P = price of perpetual
I = margin fraction for market (BTC is 0.04 bc of 25x max leverage)
- Initial margin requirement - abs(S × P × I)
- Maintenance margin requirement - abs(S x P x M)
- Total account value: Q + sum(S x P)
- Free collateral = total account value - initial margin requirement
(Liquidations)[https://docs.dydx.exchange/#liquidations]
- Close Price (Short) = P × (1 + (M × V / W))
- Close Price (Long) = P × (1 − (M × V / W))
