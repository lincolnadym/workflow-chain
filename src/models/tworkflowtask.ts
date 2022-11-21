import { IContextItem, IWorkflowContext } from './common';
import { Logger as Log } from './logger';

/**
 * Partial Interface of a task definition.  This defines a single task
 * resource.
 */
export interface ITaskResource {
  resourceId: string;
  resourceValue: any;
}

/**
 * Partial Interface of a workflow definition.  This defines a single workflow
 * task within the workflow.
 */
export interface ITaskDefinition {
  taskSequence?: number;
  taskId: string;
  taskName: string;
  taskClass: string;
  nextTasks: string[]; // Array of WorkflowTask classname as next
  taskActive?: boolean;
  taskResources?: ITaskResource[];
}

/**
 * Primary interface for a task.  Accepts the current
 * workflow context for each task and task doMethod.  Each
 * domethod returns an IContextItem that you can add to the
 * workflow context within your doRunWorkflow override.
 */
export interface ITask {
  doPreTask: (wfContext?: IWorkflowContext) => IContextItem;
  doRunTask: (wfContext?: IWorkflowContext) => IContextItem;
  doPostTask: (wfContext?: IWorkflowContext) => IContextItem;
  getTaskDefinition(): ITaskDefinition;
  getTaskResources(): ITaskResource[];
  addContext(
    wfContext: IWorkflowContext,
    theContextItem: IContextItem,
  ): IWorkflowContext;
}

/**
 * Primary class that all tasks should extend.  Accepts a task
 * definition JSON object that fits an ITaskDefinition.  This
 * provides any "known" properties.  There are 3 doMathods that
 * provide for pre-, run- and post- task execution.
 *
 * @param Constructor takes an ITaskDefinition.
 */
export class TWorkflowTask implements ITask {
  constructor(protected taskDefinition: ITaskDefinition) {}

  /**
   * Provides a method to initialize task constructs.  These
   * are usually constructs and resources that the task needs.
   * @returns The task context item.
   */
  public doPreTask(wfContext?: IWorkflowContext): IContextItem {
    Log.info(
      `- WorkflowTask - Task ${this.taskDefinition.taskName} - doPreTask() -`,
    );
    return {
      contextKey: `${this.constructor.name}:doPreTask`,
      contextValue: {},
      statusCode: 'SUCCESS',
    };
  }

  /**
   * Provides a method to run the task logic.  Override this in
   * each task and customize the return context item.
   * @returns The task context item.
   */
  public doRunTask(wfContext?: IWorkflowContext): IContextItem {
    Log.info(
      `- WorkflowTask - Task ${this.taskDefinition.taskName} - doRunTask() -`,
    );
    return {
      contextKey: `${this.constructor.name}:doRunTask`,
      contextValue: {},
      statusCode: 'SUCCESS',
    };
  }

  public doPostTask(wfContext?: IWorkflowContext): IContextItem {
    Log.info(
      `- WorkflowTask - Task ${this.taskDefinition.taskName} - doPostTask() -`,
    );
    return {
      contextKey: `${this.constructor.name}:doPostTask`,
      contextValue: {},
      statusCode: 'SUCCESS',
    };
  }
  public getTaskDefinition(): ITaskDefinition {
    return this.taskDefinition;
  }
  public getTaskResources(): ITaskResource[] {
    return this.taskDefinition.taskResources || [];
  }

  public addContext(
    wfContext: IWorkflowContext,
    theContextItem: IContextItem,
  ): IWorkflowContext {
    return {
      ...wfContext,
      [theContextItem.contextKey]: theContextItem,
    };
  }
}
