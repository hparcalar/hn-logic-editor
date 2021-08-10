import { IComType } from "./base/com-type";
import { IDevice } from "./base/device";

export class EmptyDevice implements IDevice{
    inputCount!: number;
    outputCount!: number;
    inputs!: IComType[];
    outputs!: IComType[];
    
}