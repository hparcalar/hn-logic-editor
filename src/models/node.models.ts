export interface AppModel {
    hnAppId: number
    appName: string
    isActive: boolean
}

export interface ProcessModel {
    hnProcessId: number
    isActive: boolean
    name: string
    hnAppId: number
    delayBefore: number
    delayAfter: number
    canRepeat: boolean
    steps: ProcessStepModel[]
    procStatus: number
    liveCondition: string
}

export interface ProcessStepModel {
    processStepId: number
    explanation: string
    comparison: string
    resultAction: string
    orderNo : number
    delayBefore: number
    delayAfter: number
    hnProcessId: number
    isTestResult: boolean
    waitUntilConditionRealized: boolean
    conditionRealizeTimeout: number
}

export interface ProcessResultModel {
    id: number
    processStepId: number
    strResult: string
    numResult: number | null
    durationInSeconds: number
    createdDate: string
    isOk: boolean | null
    isTestResult: boolean
}