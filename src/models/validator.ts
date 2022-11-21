import Joi = require('joi');

/**
 * Partial schema for validation.  This defines the workflow
 * attributes.
 */
export const joiWorkflowAtttributes = {
  workflowName: Joi.string().required(),
  workflowDescription: Joi.string().optional(),
  workflowContext: Joi.object().optional(),
  workflowNamespace: Joi.string().required(),
  workflowStart: Joi.string().required(),
};

/**
 * Joi validation schema for a workflow definition.
 */
export const joiSchemaWFDefinition = {
  workflowAttributes: joiWorkflowAtttributes,
  workflowTasks: Joi.array().required(),
};

/**
 * Utility function that checks that an object is a
 * workflow definition object.
 * @param theObject The object to validate
 * @returns A Joi validation result, ( value, error )
 */
export function isAWorkflowDefinition(theObject: any) {
  return 'workflowAttributes' in theObject && 'workflowTasks' in theObject;
}

/**
 * A validation utility class that provides a number of
 * validation methods.  Validations will do a deep validation,
 * meaning that the entire object is validated.
 */
export class Validator {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  constructor(private request: any, private schema: any) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public isValid(): Joi.ValidationResult {
    const joiOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      // stripUnknown: true, // remove unknown props
    };

    return Joi.object(this.schema).validate(this.request, joiOptions);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public isValidObject(request: unknown, theSchema: any): Joi.ValidationResult {
    const joiOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      // stripUnknown: true, // remove unknown props
    };

    return Joi.object(theSchema).validate(request, joiOptions);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public isValidTObject<T>(
    request: T,
    theSchema: any,
  ): Joi.ValidationResult<T> {
    const joiOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      // stripUnknown: true, // remove unknown props
    };

    return Joi.object<T>(theSchema).validate(request, joiOptions);
  }
}
