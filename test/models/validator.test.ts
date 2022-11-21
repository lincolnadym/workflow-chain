import {
  Validator,
  joiSchemaWFDefinition,
  isAWorkflowDefinition,
} from '../../src/models';
import { mockWFDefinition } from '../__mock__/common';

let joiRequest = {};

const mockBadWFDefinition = {
  workflowAttributes: {
    workflowName: 'sample-workflow',
    workflowDescription: 'Implements a sample workflow',
    workflowContext: undefined,
    workflowNamespace: 'SampleWorkflow',
    workflowStart: 'WorkflowTask001',
  },
};

describe('Validator Tests', () => {
  let theValidator: Validator;

  beforeEach(() => {
    joiRequest = mockWFDefinition;
    theValidator = new Validator(joiRequest, joiSchemaWFDefinition);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Validator', () => {
    test('should return validated workflow definition', () => {
      theValidator = new Validator(joiRequest, joiSchemaWFDefinition);
      const joiValidation = theValidator.isValidObject(
        joiRequest,
        joiSchemaWFDefinition,
      );
      expect(joiValidation.value).toBeDefined();
      expect(joiValidation.error).toBeUndefined();
    });
    test('should return validation error when an invalid request object', () => {
      theValidator = new Validator(mockBadWFDefinition, joiSchemaWFDefinition);
      const joiValidation = theValidator.isValid();
      expect(joiValidation.error).toBeDefined();
      expect(joiValidation.error?.message).toContain(
        'workflowTasks" is required',
      );
    });
    test('should return validation value as T for isValidTObject', () => {
      const joiValidation = theValidator.isValidTObject(
        joiRequest,
        joiSchemaWFDefinition,
      );
      expect(joiValidation.error).toBeUndefined();
      expect(isAWorkflowDefinition(joiValidation.value)).toBe(true);
    });
    test('should return true for an object validation', () => {
      expect(isAWorkflowDefinition(joiSchemaWFDefinition)).toBe(true);
    });
  });
});
