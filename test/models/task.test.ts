import { ITask, IWorkflowContext, TWorkflowTask } from '../../src/models';
import { mockWFDefinition } from '../__mock__/common';

const testWFDefinition = mockWFDefinition;

describe('Task Objects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should allocate a task definition', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[0],
    );

    expect(theWFTask).toBeDefined();
    expect(theWFTask.getTaskDefinition()).toBeDefined();
    expect(theWFTask.getTaskDefinition().taskSequence).toBe(1);
    // expect(theWFTask.getTaskDefinition().taskResources).toBeUndefined();
  });
  test('should allocate a task definition with resources', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[1],
    );

    expect(theWFTask).toBeDefined();
    expect(theWFTask.getTaskDefinition()).toBeDefined();
    expect(theWFTask.getTaskDefinition().taskSequence).toBeUndefined();
    expect(theWFTask.getTaskDefinition().taskResources).toMatchObject([
      { resourceId: 'r001', resourceValue: 'test1-resource' },
      { resourceId: 'r002', resourceValue: 'test2-resource' },
      {
        resourceId: 'r003',
        resourceValue: {
          eventId: 'some-uuid',
          eventSource: 'some.domain.com',
        },
      },
    ]);
  });
  test('should run pre-task method and return task context for doPreTask', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[1],
    );

    expect(theWFTask.doPreTask()).toMatchObject({
      contextKey: 'TWorkflowTask:doPreTask',
      contextValue: {},
    });
  });
  test('should run run-task method and return task context for doRunTask', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[1],
    );

    expect(theWFTask.doRunTask()).toMatchObject({
      contextKey: 'TWorkflowTask:doRunTask',
      contextValue: {},
    });
  });
  test('should run post-task method and return task context for doPostTask', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[1],
    );

    expect(theWFTask.doPostTask()).toMatchObject({
      contextKey: 'TWorkflowTask:doPostTask',
      contextValue: {},
    });
  });
  test('should return task resources when they exist', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[1],
    );

    expect(theWFTask.getTaskResources()).toMatchObject([
      { resourceId: 'r001', resourceValue: 'test1-resource' },
      { resourceId: 'r002', resourceValue: 'test2-resource' },
      {
        resourceId: 'r003',
        resourceValue: {
          eventId: 'some-uuid',
          eventSource: 'some.domain.com',
        },
      },
    ]);
  });
  test('should return [] task resources when they are undefined', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[0],
    );

    expect(theWFTask.getTaskResources()).toMatchObject([]);
  });
  test('should run task method and append to the workflow context', async () => {
    const theWFTask: ITask = new TWorkflowTask(
      testWFDefinition.workflowTasks[1],
    );
    let wfContext: IWorkflowContext = {
      task001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
      task002: {
        contextKey: 'wfTask002',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    };
    wfContext = theWFTask.addContext(wfContext, {
      contextKey: 'task003:doPostTask',
      contextValue: {
        payload: 'payload-id',
        innerPayload: {
          key001: 'lookup001',
          value001: 'value001',
        },
      },
      statusCode: 'SUCCESS',
    });

    expect(wfContext).toMatchObject({
      task001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
      task002: {
        contextKey: 'wfTask002',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
      'task003:doPostTask': {
        contextKey: 'task003:doPostTask',
        contextValue: {
          payload: 'payload-id',
          innerPayload: {
            key001: 'lookup001',
            value001: 'value001',
          },
        },
        statusCode: 'SUCCESS',
      },
    });
  });
});
