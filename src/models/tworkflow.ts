import { ITaskDictionary, IWorkflowContext, IContextItem } from './common';
import { Logger as Log } from './logger';
import { ITask } from './tworkflowtask';
import { ITaskDefinition } from './tworkflowtask';
import { joiSchemaWFDefinition, Validator } from './validator';

import Joi = require('joi');

/**
 * Partial Interface of a workflow definition.  This defines the workflow
 * attributes.
 */
export interface IWorkflowAttributes {
  workflowName: string;
  workflowDescription: string;
  workflowContext?: IWorkflowContext;
  workflowNamespace: string;
  workflowStart: string; // WorkflowTask classname to start the workflow.
}

/**
 * Interface of a workflow definition.  Use this to type guard your definition
 * json and maintain consistency
 */
export interface IWorkflowDefinition {
  workflowAttributes: IWorkflowAttributes;
  workflowTasks: ITaskDefinition[];
}

/**
 * Primary Workflow class that your Workflow MUST extend.  This class
 * provides a task dictionary as well as a very simple pre-, run-, and
 * -post methods.  There are methods to handle validation, getters, setters,
 * and boilerplate methods for all workflows.
 * Usage :
 * Your workflow sub-class must handle the following initialization
 * tasks.  In a nutshell :
 * - Iterate thru all the task definitions and create dynamic instances.  You
 * can copy the constructor in the sample workflow.  We used a Namespace
 * to contain the definition and WorkflowTasks.
 * - Store the dynamic instances into the task dictionary.
 * @see The sample workflow for details on the Namespace.
 */
export class TWorkflow {
  protected workflowTasks: ITaskDictionary;
  protected workflowContext: IWorkflowContext;

  constructor(protected wfDefinition: IWorkflowDefinition) {
    this.workflowTasks = {};
    this.workflowContext = {};
  }

  /**
   * Simple validation method that checks/verifies whether the
   * workflow definition is valid or not.
   * @returns A validation object on whether the workflow definition
   * is valid or not.
   */
  public doValidation(): Joi.ValidationResult {
    Log.info(`- Workflow - doInitialize() - ITaskDefinitions -`);
    const theValidator = new Validator(
      this.wfDefinition,
      joiSchemaWFDefinition,
    );

    return theValidator.isValidTObject<IWorkflowDefinition>(
      this.wfDefinition,
      joiSchemaWFDefinition,
    );
  }

  /**
   * Provides a setup, configuration and/or initialization of
   * the workflow.  Accepts no argument and returns no
   * context.  Operates off the workflow context.
   */
  public doPreWorkflow(): void {
    this.addContext({
      contextKey: `${this.constructor.name}:doPreWorkflow`,
      contextValue: {},
      statusCode: 'SUCCESS',
    });
  }

  /**
   * Provides a default execution path for the tasks in the
   * dictionary.  Simply runs thru the START, nextSteps
   * section of the task defintions.  Operates off the workflow context.
   */
  public doRunWorkflow(): void {
    Log.info(`- Workflow - doRunWorkflow() -`);
    Log.info(`- Workflow - Tasks -`);
    Object.keys(this.getTaskDictionary()).forEach((x, k) => {
      Log.info(x, this.getTaskDictionary()[k]); // All fine!
      // if (this.isKey<ITask>(x, k))
    });
    let atBat: ITask = this.getTaskDictionary()[this.getWorkflowStartTask()];
    let onDeck: boolean = true;
    do {
      Log.info(`Running Task ${atBat.getTaskDefinition().taskName}`);
      this.addContext(atBat.doPreTask());
      this.addContext(atBat.doRunTask());
      this.addContext(atBat.doPostTask());
      if (atBat.getTaskDefinition().nextTasks.length > 0) {
        atBat = this.workflowTasks[atBat.getTaskDefinition().nextTasks[0]];
      } else {
        onDeck = false;
      }
    } while (onDeck === true);
  }

  // public isKey<T>(x: T, k: PropertyKey): k is keyof T {
  //   return k in x;
  // }

  /**
   * Provides an adhoc method that runs a task's pre-, run- and
   * post- methods in an adhoc/custom sequence.  Operates off the workflow context.
   */
  public runTask(theTask: ITaskDefinition): void {
    Log.info(`- Workflow - ITaskDefinitions - doPostWorkflow() -`);
  }

  /**
   * Provides a standard method to do post execution cleanup,
   * packaging, notifications, etc...
   */
  public doPostWorkflow(): void {
    this.addContext({
      contextKey: `${this.constructor.name}:doPostWorkflow`,
      contextValue: {},
      statusCode: 'SUCCESS',
    });
  }

  public getWorkflowAttributes(): IWorkflowAttributes {
    return this.wfDefinition.workflowAttributes;
  }

  public getWorkflowStartTask(): string {
    return this.getWorkflowAttributes().workflowStart;
  }

  public getTaskDictionary(): ITaskDictionary {
    return this.workflowTasks;
  }
  public getWorkflowContext(): IWorkflowContext {
    return this.workflowContext;
  }
  public setWorkflowContext(wfContext: IWorkflowContext): void {
    this.workflowContext = wfContext;
  }

  /**
   * Accepts a task based context item and appends it to the
   * workflow context.  The context (dictionary) key is the
   * contextKey of the parameter.
   * @param theContextItem The context item to add to the workflow context
   */
  public addContext(theContextItem: IContextItem): void {
    this.workflowContext = {
      ...this.workflowContext,
      [theContextItem.contextKey]: theContextItem,
    };
  }
  public getContextItem(theContextKey: string): IContextItem {
    return this.workflowContext[theContextKey];
  }
}
