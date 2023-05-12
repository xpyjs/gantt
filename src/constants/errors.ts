import { Variables } from './vars';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Errors {
  private static readonly header = `[${Variables.name.root} warn]`;
  private static readonly invalidProps = 'Invalid props:';
  private static readonly nullKeys = 'Null keys:';
  private static readonly formatError = 'Format error:';
  private static readonly typeError = 'Type error:';

  static error(message: string) {
    return new Error(`${Errors.header}: ${message}`);
  }

  static propsError(message: string) {
    return new Error(`${Errors.header} ${Errors.invalidProps} ${message}`);
  }
}

export default Errors;
