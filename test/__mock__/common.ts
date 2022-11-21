import { IWorkflowDefinition } from '../../src/models';

export const mockWFDefinition: IWorkflowDefinition = {
  workflowAttributes: {
    workflowName: 'sample-workflow',
    workflowDescription: 'Implements a sample workflow',
    workflowContext: undefined,
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
      taskResources: [
        { resourceId: 'r001', resourceValue: 'test1-resource' },
        { resourceId: 'r002', resourceValue: 'test2-resource' },
        {
          resourceId: 'r003',
          resourceValue: {
            eventId: 'some-uuid',
            eventSource: 'some.domain.com',
          },
        },
      ],
    },
  ],
};
