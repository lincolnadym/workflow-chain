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
  private static log(
    { args = [], level }: { args?: any[]; level: LogLevel },
    operator: 'log' | 'error' | 'debug' | 'info' | 'warn' = 'log',
  ) {
    const logLevel = +(process.env.LOG_LEVEL || LogLevel.Info) as LogLevel;
    if (level <= logLevel) {
      // console[operator](...args);
      console.log(
        util.inspect(...args, { showHidden: false, depth: null, colors: true }),
      );
    }
  }

  public static fatal(...args: any[]) {
    this.log({ args, level: LogLevel.Fatal }, 'error');
  }

  public static error(...args: any[]) {
    this.log({ args, level: LogLevel.Error }, 'error');
  }

  public static warning(...args: any[]) {
    this.log({ args, level: LogLevel.Warning }, 'warn');
  }

  public static info(...args: any[]) {
    this.log({ args, level: LogLevel.Info }, 'info');
  }

  public static debug(...args: any[]) {
    this.log({ args, level: LogLevel.Debug }, 'debug');
  }
}
