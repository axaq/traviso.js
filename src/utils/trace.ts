let logEnabled: boolean = true;

/**
 * Writes logs to the browser console
 *
 * @method trace
 * @memberof TRAVISO
 * @static
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
 * @static
 * @memberof TRAVISO
 * @function enableDisableLogging
 * @param [enabled=true] {boolean} enable logging or not
 * @return {boolean} logging enabled or not
 */
export function enableDisableLogging(enabled: boolean = true): boolean {
    return (logEnabled = enabled);
}
