import { ITask } from './tworkflowtask';

/**
 * Utility interface that defines a simple string indexed collection
 * of the tasks that the workflow will run.
 * Usage :
 * - put - Putting an element on the dictionary.
 * this.workflowTasks[theItem.taskName] = theTask;
 * - get - Getting an element off the dictionary.
 * theTask = this.workflowTasks[theItem.taskName];
 */
export interface ITaskDictionary {
  [index: string]: ITask;
}

/**
 * Simple response object.
 */
export class TResponse<T> {
  body?: T;
  error?: string;
  statusCode: number;
}

/**
 * Partial Interface of a workflow context item.  This contains an
 * individual error that occurred within a task or workflow method.
 */
export interface IContextError {
  errorMessage: string;
  errorContent: any;
}

/**
 * Partial Interface of a workflow context.  This contains the
 * initialization context and individual task results.
 */
export interface IContextItem {
  contextKey: string;
  contextValue?: any;
  statusCode: string;
  errorCount?: number;
  errorItems?: IContextError[];
}

/**
 * Partial Interface of a workflow definition.  This defines the workflow
 * context data and individual task responses.  By default, the
 * core doRunWorkflow will add each task's context using the
 * taskClass.constructor.name:method-name.
 */
export interface IWorkflowContext {
  [index: string]: IContextItem;
}
