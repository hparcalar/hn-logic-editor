import { AppModel, ProcessModel, ProcessResultModel } from '../models/node.models';
import { ApiGeneric } from './base/api.generic';

export class LogicService {
  apiObject: ApiGeneric = new ApiGeneric();

  // #region APPS DATA
  async getApps() {
    const data = await this.apiObject.getAll('Apps');
    return data;
  }

  async getApp(id: number) {
    const data = await this.apiObject.get('Apps', id);
    return data;
  }

  async saveApp(model: AppModel) {
      return await this.apiObject.save('Apps', model);
  }
  // #endregion

  // #region PROCESS DATA
  async getProcesses() {
    const data = await this.apiObject.getAll('Process');
    return data;
  }

  async getProcess(id: number) {
    const data = await this.apiObject.get('Process', id);
    return data;
  }

  async saveProcess(model: ProcessModel) {
      return await this.apiObject.save('Process', model);
  }
  // #endregion

  // #region RESULTS DATA
  async getResults() {
    const data = await this.apiObject.getAll('Results');
    return data;
  }

  async getResult(id: number) {
    const data = await this.apiObject.get('Results', id);
    return data;
  }

  async saveResult(model: ProcessResultModel) {
      return await this.apiObject.save('Results', model);
  }
  // #endregion
}
