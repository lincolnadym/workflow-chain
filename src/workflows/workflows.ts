import { ITask, ITaskDefinition, IWorkflowDefinition, TWorkflow, Logger as Log } from '../models';
import { SampleWorkflowNS } from './sample-workflow';

/**
 * A sample workflow class that illustrates how you extend the
 * TWorkflow class.  It's also critical that the constructor 
 * implement a loop thru all task-definitions in the workflow
 * definition and create dynamic runtime task class instances.  These
 * runtime tasks are added to the task dictionary.
 */
export class WorkflowSample extends TWorkflow {
  constructor(protected wfDefinition: IWorkflowDefinition) {
    super(wfDefinition);
    this.wfDefinition.workflowAttributes.workflowName = this.constructor.name;
    wfDefinition.workflowTasks.forEach((theItem: ITaskDefinition) => {
      //   Log.info(`- TaskLoader - ${wfDefinition.workflowAttributes.workflowName} - Task ${JSON.stringify(theItem)}`);
      let theTask: ITask;
      try {
        // DYNAMIC : Create a class dynamically from a classname.  Use the 
        // Namespace as a "scope"
        theTask = new (<any>SampleWorkflowNS)[theItem.taskClass](theItem);
        // DICTIONARY : Store the dynamic class into the dictionary
        this.workflowTasks[theItem.taskName] = theTask;
      } catch (error) {
        this.log.info(`Dynamic class create error ${JSON.stringify(error)}`);
      }
    });
  }
}
