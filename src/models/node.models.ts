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
    steps: ProcessStepModel[]
}

export interface ProcessStepModel {
    ProcessStepId: number
    Explanation: string
    Comparison: string
    ResultAction: string
    DelayBefore: number | null
    DelayAfter: number | null
    HnProcessId: number
}

export interface ProcessResultModel {
    Id: number
    ProcessStepId: number
    StrResult: string
    NumResult: number | null
    CreatedDate: string
}