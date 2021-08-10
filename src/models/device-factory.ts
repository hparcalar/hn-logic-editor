import { IDevice } from "./base/device";
import { EmptyDevice } from "./empty-device";
import { MoxaStandardDevice } from "./moxa-standard";

export enum DeviceTypes {
    MOXA_STANDART = 1
}

export class DeviceFactory{
    getDeviceData(deviceType: DeviceTypes) : IDevice {
        let deviceData:IDevice = new EmptyDevice();
        
        if (deviceType == DeviceTypes.MOXA_STANDART)
            deviceData = new MoxaStandardDevice();
        
        return deviceData
    }
}