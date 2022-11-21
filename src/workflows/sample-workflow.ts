import {
  IContextItem,
  ITaskDefinition,
  IWorkflowDefinition,
  TWorkflowTask,
  Logger as Log,
} from '../models';

/**
 * A sample workflow namespace.  While export of a namespce is
 * considered bad practice, it's the only way to provide a
 * scope within the TWorkflow class to dynamically create the
 * task classses.
 *
 * We typically put the following within the namespace :
 * - Workflow Definition JSON
 * - WotkflowTask classes.  This simplifies the dynamic creation of
 * task classes.
 */
export namespace SampleWorkflowNS {
  export const sampleWorkflow: IWorkflowDefinition = {
    workflowAttributes: {
      workflowName: 'sample-workflow',
      workflowDescription: 'Implements a sample workflow',
      workflowContext: {
        payload: {
          contextKey: 'data',
          contextValue: { one: '111', two: '222' },
          statusCode: '0',
        },
      },
      workflowNamespace: 'SampleWorkflow',
      workflowStart: 'WorkflowTask001',
    },
    workflowTasks: [
      {
        taskSequence: 1,
        taskId: 'workflow-001',
        taskName: 'step-001',
        taskClass: 'WorkflowTask001',
        nextTasks: ['WorkflowTask002'],
        taskActive: true,
      },
      {
        taskId: 'workflow-002',
        taskName: 'step-001',
        taskClass: 'WorkflowTask002',
        nextTasks: [],
        taskActive: true,
      },
    ],
  };

  export class WorkflowTask001 extends TWorkflowTask {
    constructor(taskDefinition: ITaskDefinition) {
      super(taskDefinition);
      this.taskDefinition.taskName = this.constructor.name;
    }
    // doPreTask(): void {
    //   Log.info(`- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPreTask() -`);
    // }
    doRunTask(): IContextItem {
      Log.info(
        `- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doRunTask() -`,
      );
      return {
        contextKey: `${this.taskDefinition.taskName}:doRunTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
    doPostTask(): IContextItem {
      Log.info(
        `- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPostTask() -`,
      );
      return {
        contextKey: `${this.taskDefinition.taskName}:doPostTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
  }

  export class WorkflowTask002 extends TWorkflowTask {
    constructor(taskDefinition: ITaskDefinition) {
      super(taskDefinition);
      this.taskDefinition.taskName = this.constructor.name;
    }
    // doPreTask(): void {
    //   Log.info(`- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPreTask() -`);
    // }
    doRunTask(): IContextItem {
      Log.info(
        `- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doRunTask() -`,
      );
      return {
        contextKey: `${this.taskDefinition.taskName}:doPostTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
    doPostTask(): IContextItem {
      Log.info(
        `- WorkflowTaskOne - Task ${this.taskDefinition.taskName} - doPostTask() -`,
      );
      return {
        contextKey: `${this.taskDefinition.taskName}:doPostTask`,
        contextValue: {},
        statusCode: 'SUCCESS',
      };
    }
  }
}
