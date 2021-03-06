let saidHello = false;
const VERSION = '$_VERSION';

/**
 * Skips the hello message of renderers that are created after this is run.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @function
 * @method
 * @static
 * @public
 */
export function skipHello(): void {
    saidHello = true;
}

/**
 * Logs out the version information for this running instance of TRAVISO.
 * If you don't want to see this message you can run `TRAVISO.skipHello()` before
 * creating your engine.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @function
 * @method
 * @static
 * @public
 */
export function sayHello(): void {
    if (saidHello) {
        return;
    }

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        const args = [
            `\n %c %c %c Traviso.js - ${VERSION}  %c  %c  http://www.travisojs.com/  %c  \n\n`,
            'background: #18bc9c; padding:5px 0;',
            'background: #18bc9c; padding:5px 0;',
            'color: #18bc9c; background: #030307; padding:5px 0;',
            'background: #18bc9c; padding:5px 0;',
            'background: #5ad2ba; padding:5px 0;',
            'background: #18bc9c; padding:5px 0;',
        ];

        self.console.log(...args);
    } else if (self.console) {
        self.console.log(`Traviso.js ${VERSION} - http://www.travisojs.com/`);
    }

    saidHello = true;
}
