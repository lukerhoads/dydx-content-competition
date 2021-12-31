import { MarketsResponseObject, Data } from "@dydxprotocol/v3-client";
import axios, { AxiosRequestConfig } from "axios";
import { generateQueryPath } from "./helpers";
import { DydxMarket } from "../types/market";

export default class Dydx {
    readonly host: string 

    constructor(host: string) {
        this.host = host
    }

    getMarkets(market?: DydxMarket): Promise<{ markets: MarketsResponseObject }> {
        const uri: string = 'markets';
        return this.get(uri, { market });
    }

    private get(
        requestPath: string,
        params: {},
    ): Promise<Data> {
        return this.axiosRequest({
            method: 'GET',
            url: `${this.host}/v3/${generateQueryPath(requestPath, params)}`,
        });
    }

    private async axiosRequest(options: AxiosRequestConfig) {
        const response = await axios(options)
        return response.data
    }
}