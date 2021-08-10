import { IComType } from "./com-type";

export interface IDevice{
    inputCount: number
    outputCount: number
    inputs: IComType[],
    outputs: IComType[]
}