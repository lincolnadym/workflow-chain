import {
  IWorkflowContext,
  TWorkflowTask,
  Logger,
  LogLevel,
} from '../../src/models';
import { SampleWorkflowNS } from '../../src/workflows';
import { WorkflowSample } from '../../src/workflows';
import { mockWFDefinition } from '../__mock__/common';

const testDefinitions = mockWFDefinition;

describe('Task Objects', () => {
  let theWorkflow: WorkflowSample;
  const log: Logger = new Logger(LogLevel.Debug);
  beforeEach(() => {
    theWorkflow = new WorkflowSample(SampleWorkflowNS.sampleWorkflow);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should allocate the workflow with definition correctly', async () => {
    expect(theWorkflow.getWorkflowAttributes()).toMatchObject({
      workflowName: 'WorkflowSample',
      workflowDescription: 'Implements a sample workflow',
      workflowContext: {
        payload: {
          contextKey: 'data',
          contextValue: {
            one: '111',
            two: '222',
          },
          statusCode: '0',
        },
      },
      workflowNamespace: 'SampleWorkflow',
      workflowStart: 'WorkflowTask001',
    });
  });
  test('should validate the workflow correctly', async () => {
    const wfValidation = theWorkflow.doValidation();

    expect(wfValidation.value).toBeDefined();
    expect(wfValidation.error).toBeUndefined();
  });
  test('should return starting class when it exists', async () => {
    expect(theWorkflow.getWorkflowStartTask()).toBe('WorkflowTask001');
  });
  test('should allocate a workflow with task instances', async () => {
    theWorkflow.doRunWorkflow();

    expect(theWorkflow).toBeDefined();
    Object.keys(theWorkflow.getTaskDictionary()).forEach((key, task) => {
      expect(
        theWorkflow.getTaskDictionary()[key] instanceof TWorkflowTask,
      ).toBe(true);
      log.info(
        `Task Key [${key}] Dictionary [${theWorkflow.getTaskDictionary()[key]}`,
      ); // All fine!
      // if (theWorkflow.isKey(theWorkflow.getTaskDictionary()[key], key)) {
      // }
    });
  });
  test('should allocate a workflow with a task instance with a task definition', async () => {
    log.info('- theWorkflow.getTaskDictionary -');
    log.info(theWorkflow.getTaskDictionary()['WorkflowTask001']);
    expect(theWorkflow.getTaskDictionary()).toBeDefined();
    expect(
      theWorkflow.getTaskDictionary()['WorkflowTask001'] instanceof
        TWorkflowTask,
    ).toBe(true);
    expect(theWorkflow.getTaskDictionary()['WorkflowTask001']).toMatchObject({
      taskDefinition: {
        taskSequence: 1,
        taskId: 'workflow-001',
        taskName: 'WorkflowTask001',
        taskClass: 'WorkflowTask001',
        nextTasks: ['WorkflowTask002'],
        taskActive: true,
      },
    });
  });
  test('should build a workflow context as a string indexed dictionary', async () => {
    let wfContext: IWorkflowContext = {
      task001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    };

    expect(wfContext).toMatchObject({
      task001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    });

    wfContext = {
      ...wfContext,
      task002: {
        contextKey: 'wfTask002',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    };

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
    });
  });
  test('setWorkflowContext should set the workflow context', async () => {
    const wfContext: IWorkflowContext = {
      task001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    };

    expect(theWorkflow.getWorkflowContext()).toBeDefined();
    theWorkflow.setWorkflowContext(wfContext);
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      task001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    });
  });
  test('doPreWorkflow should add default context to the workflow context', async () => {
    expect(theWorkflow.getWorkflowContext()).toMatchObject({});
    theWorkflow.doPreWorkflow();
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      'WorkflowSample:doPreWorkflow': {
        contextKey: 'WorkflowSample:doPreWorkflow',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
    });
  });
  test('doPostWorkflow should add default context to the workflow context', async () => {
    expect(theWorkflow.getWorkflowContext()).toMatchObject({});
    theWorkflow.doPostWorkflow();
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      'WorkflowSample:doPostWorkflow': {
        contextKey: 'WorkflowSample:doPostWorkflow',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
    });
  });
  test('setWorkflowContext should set/override the current workflow context', async () => {
    const wfContext: IWorkflowContext = {
      wfTask001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    };

    expect(theWorkflow.getWorkflowContext()).toMatchObject({});
    theWorkflow.doPreWorkflow();
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      'WorkflowSample:doPreWorkflow': {
        contextKey: 'WorkflowSample:doPreWorkflow',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
    });
    theWorkflow.setWorkflowContext(wfContext);
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      wfTask001: {
        contextKey: 'wfTask001',
        contextValue: { eleOne: 'elementOne' },
        statusCode: 'SUCCESS',
      },
    });
  });
  test('getContextItem should return correct indexed context item', async () => {
    expect(theWorkflow.getWorkflowContext()).toMatchObject({});
    theWorkflow.doPreWorkflow();
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      'WorkflowSample:doPreWorkflow': {
        contextKey: 'WorkflowSample:doPreWorkflow',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
    });
    expect(
      theWorkflow.getContextItem('WorkflowSample:doPreWorkflow'),
    ).toMatchObject({
      contextKey: 'WorkflowSample:doPreWorkflow',
      contextValue: {},
      statusCode: 'SUCCESS',
    });
  });
  test('should build the workflow context as tasks execute', async () => {
    expect(theWorkflow.getWorkflowContext()).toMatchObject({});
    theWorkflow.doPreWorkflow();
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      'WorkflowSample:doPreWorkflow': {
        contextKey: 'WorkflowSample:doPreWorkflow',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
    });
    log.info('- theWorkflow.doRunWorkflow - Context - Before -');
    log.info(theWorkflow.getWorkflowContext());
    theWorkflow.doRunWorkflow();
    log.info('- theWorkflow.doRunWorkflow - Context - After -');
    log.info(theWorkflow.getWorkflowContext());
    expect(theWorkflow.getWorkflowContext()).toMatchObject({
      'WorkflowSample:doPreWorkflow': {
        contextKey: 'WorkflowSample:doPreWorkflow',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
      'WorkflowTask001:doPreTask': {
        contextKey: 'WorkflowTask001:doPreTask',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
      'WorkflowTask001:doRunTask': {
        contextKey: 'WorkflowTask001:doRunTask',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
      'WorkflowTask001:doPostTask': {
        contextKey: 'WorkflowTask001:doPostTask',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
      'WorkflowTask002:doPreTask': {
        contextKey: 'WorkflowTask002:doPreTask',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
      'WorkflowTask002:doPostTask': {
        contextKey: 'WorkflowTask002:doPostTask',
        contextValue: {},
        statusCode: 'SUCCESS',
      },
    });
  });
});
