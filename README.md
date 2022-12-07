# Workflow-chain
The workflow-chain library, herinafter simply workflow, is a simple task based workflow library that provides types, interfaces, classes, validation and supporting functions to assist a developer to design, develop and implement task based workflows.  Workflows can be hosted and run within a variety of constructs.  Web/UI, AWS Lambdas, Node processing or just about anything that runs Node.

## Project
The workflow project is a simple library that provides Types, Interfaces, validation and a sample.  The library is based on the following processing paradigm.

- A customer/client has various processing needs that go beyond a simple button click.
- These workflows require a mixed amount of time to execute.
- A workflow requires 1 or more steps to complete.
- Each step can be thought of as a task.
- A workflow runs a sequence of tasks.
- The workflow is defined using a JSON workflow definition.
- The workflow definition contains the "starting" task class, and then each task definition contains a nextSteps: array of the next task class to run.
- The "chain" of tasks thus defined the workflow.
- Hence workflow-chain.

Obviously, I've simplified the process, but the above is a very simple set of principles for any workflow.  The workflow can be run as part of a long running Web/UI process, a node process, AWS lambdas, etc...

The principles are simple, articulate your process as a workflow and then begine to divide-and-conquer individual, discrete "tasks" within the workflow.  A few iteration cycles and your workflow can be broken down into a simple "chain" of tasks.

## Essential Concepts

### Workflow Definition
The workflow requires a workflow definition, a JSON object that adheres to the IWorkflowDefinition type interface.  The definition essentially describes (defines) the workflow as a textual representation.  A definition contains the following tier 1 elements : 

- Workflow Attributes - These are traditional elements such as name, description, namespace, workflow context (discussed later) and the "starting" classname.
- Workflow Tasks - An array of JSON objects of each task class that the workflow needs.

#### Workflow Context
The workflow context provides a simple string indexed JSON dictionary where all input task and task results are stored.  As the workflow progresses thru the tasks, the context will grow, keeping track of each task's outcome.

Index Key - Typically the Task Classname:doMethod

### Workflow Namespace
The workflow relies on a namespace for each workflow you design and implement.  We'll see later why this is.  The NS provides a scoped contruct that the workflow will utilize to dynamically generate task class runtime instances.  Inside this NS, you define the following : 

- Workflow Definition - This can be any JSON construct that adheres to the IWorkflowDefinition Type Interface.



## Tasks and Reuse
A residual benefit is realized in the tasks.  As you build more and more workflows, you'll begin to design and develop tasks that are more discrete and reusable.  This task growth perpetuates faster workflow development as new and future workflows begin needing a task developed in a previous workflow.

For larger scope projects you'll find a need for libraries of tasks...one for file utilities, one for AWS Dynamo, one for Company specific tasks.  As the libraries grow, workflow creation is faster and "tested".

# Creating a Workflow
The following is a simple step-by-step guide on creating a workflow.

## Guidelines

- Design and breakdown your workflow into discrete tasks.  Think "generic", it's not CopyFinancialResultsFile it's simply CopyAFile.  It's not CalculateTaxRates, it CalculateTaxRate with a parent CalculateTaxRates that accepts the array and calls CalculateTaxRate for each array item.

- Define a Namespace for your workflow.

- Define and export the workflow definition JSON.  Part of this definition is the tasks that the workflow will use.

- Define a "starting" task in your workflow definition.  Then each task definition will define nextSteps: [] with the tasks to run.  Eveything uses the actual task Classname.

- Your Workflow class extends TWorkflow, the TWorkflow is NOT intended to be used directly, but instead serve as a template for all Workflows.

- Workflow constructor accepts the IWorkflowDefinition.  The workflow definition is JSON, structured to the interface IWorkflowDefinition.  Your JSON could be a const variable or read in from a file, or even passed in as an http request.  The definition provides workflow attributes as well as a workflowStart: which contains the classname of your starting workflow task.  The following sample provides a basic layout for a workflow definition.

```
{
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
        },
    ],
}
```

- Your TWorkflow sub-class constructor then iterates thru all workflow-definition workflowTasks: ITaskDefinitions.
- ForEach ITaskDefinition, dynamically create an ITask runtime class instance using the Namespace.
- Store the ITask class instance into the string indexed dictionary.
- Create a Namespace and define the ITask classes within the namespace...the Namespace name should then be updated in the Workflow constructor.

## Workflow Context
The workflow context is a JSON structure passed into each Task's doMethods.  The context provides a way to inject initial workflow data.  The task doMethods return context items that you can append to the workflow context.  This provides inter-task communication, an earlier task runs to
collect data that a later task will need.  When your Workflow is instantiated, the context is initialized to an empty object : {}.  Use the setWorkflowContext() to initialize the context with a data payload.

As tasks are run within the workflow, each task accepts the workflow context as the single parameter, runs code to implement the task, then adds any results to the workflow context using the addContext().  The workflow context is then returned from the task to the workflow.  Adding context is optional, some tasks simply have no results to contribute.

The typical context item uses a contextKey of `${this.constructor.name}:&lt;methodname&gt;.  This makes it easier to track and code a context item.  If another task needs data from a previous task, then it can use the classname:method.

# Local Testing
Local testing allows developers on workflow-chain the ability to make changes to the library, build it on their machine, add it to a test project, then write workflows in that project to verify the new features.

https://stackoverflow.com/questions/55560791/build-and-use-npm-package-locally

If you have made these changes on your machine.
- Run a build:local `npm run build:local` of the library.  This creates a .tgz zip file of your library with your modifications into ./dist folder.
- Copy that *.tgz file into the root of your other project that references workflow.  (you could put it anywhere but root makes things easy) of your project.
- In your project's package.json replace the reference to the workflow-chain library with the `"@adym/workflow": "file:my-packed-file.tgz"`
- Run an npm install using your modified package.json

You should have your modified copy loaded in as a dependency in node_modules.

# Development
The following section provides details on developing and enhancing the workflow-chain library.  We typically follow a development cadence like the following : 
- Checkout the workflow-chain from github
- Checkout the workflow-examples from github
- Modify the workflow-chain, adding new features and fixes
- Build the workflow-chain locally, see above instructions
- Modify the workflow-examples package.json and `npm install`
- Write and/or modify workflows to test the new features and fixes.

## Publishing
When publishing the library, use the following commands : 

```
npm login 
Username: ***********
Password: ************
Email: (this IS public)
Email: (this IS public) adymlincoln@gmail.com
npm notice Please check your email for a one-time password (OTP)
Enter one-time password: **********

npm publish --access public
```

  "files": [
    "/dist",
    "index.js",
    "index.d.ts"
  ],

"files": [
    "build/main",
    "build/module",
    "!**/*.spec.*",
    "!**/*.json",
    "CHANGELOG.md",
    "LICENSE",
    "README.md"
  ],

    "outDir": "dist",
