/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');

export enum LogLevel {
  Off = 0,
  Fatal = 1,
  Error = 2,
  Warning = 3,
  Info = 4,
  Debug = 5,
}

export class Logger {
  private logLevel: LogLevel = LogLevel.Info;
  constructor(theLogLevel?: LogLevel) {
    if (theLogLevel) {
      this.logLevel = theLogLevel;
    }
  }

  private log(
    { args = [], level }: { args?: any[]; level: LogLevel },
    operator: 'log' | 'error' | 'debug' | 'info' | 'warn' = 'log',
  ): void {
    // const logLevel = +(process.env.LOG_LEVEL || LogLevel.Info) as LogLevel;
    if (level <= this.logLevel) {
      // console[operator](...args);
      console.log(
        util.inspect(...args, { showHidden: false, depth: null, colors: true }),
      );
    }
  }

  public fatal(...args: any[]): void {
    this.log({ args, level: LogLevel.Fatal }, 'error');
  }

  public error(...args: any[]): void {
    this.log({ args, level: LogLevel.Error }, 'error');
  }

  public warning(...args: any[]): void {
    this.log({ args, level: LogLevel.Warning }, 'warn');
  }

  public info(...args: any[]): void {
    this.log({ args, level: LogLevel.Info }, 'info');
  }

  public debug(...args: any[]): void {
    this.log({ args, level: LogLevel.Debug }, 'debug');
  }
}
