import { IComType } from "./base/com-type";
import { IDevice } from "./base/device";

export class MoxaStandardDevice implements IDevice {
    constructor(){
        this.inputCount = 8;
        this.outputCount = 8;
        this.inputs = [];
        this.outputs = [];

        for (let index = 0; index < this.inputCount; index++) {
            this.inputs.push({ order: index, code: index.toString() })
        }

        for (let index = 0; index < this.outputCount; index++) {
            this.outputs.push({ order: index, code: index.toString() })
        }
    }

    inputCount!: number;
    outputCount!: number;
    inputs!: IComType[];
    outputs!: IComType[];
}