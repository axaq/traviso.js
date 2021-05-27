let logEnabled: boolean = true;

/**
 * Writes logs to the browser console
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param s {string} text to log
 */
export function trace(s: string): void {
    if (logEnabled) {
        // eslint-disable-next-line no-console
        self.console.log('TRAVISO: ' + s);
    }
}

/**
 * Determines if TRAVISO can log helper text.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param enabled {boolean} enable logging or not, default `true`
 * @return {boolean} logging enabled or not
 */
export function enableDisableLogging(enabled: boolean = true): boolean {
    return (logEnabled = enabled);
}
