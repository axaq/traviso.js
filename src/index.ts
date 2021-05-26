import { TEngineConfiguration, EngineView } from './map/EngineView';
import { sayHello } from './utils/hello';
import { enableDisableLogging, trace } from './utils/trace';
import { VERSION } from './version';

/**
 * Type declaration for global traviso configuration.
 */
export type TTravisoConfiguration = {
    /** 
     * Determines if TRAVISO can log helper text. 
     * @default false
     */
    logEnabled: boolean;
};

/**
 * Main TRAVISO namespace.
 *
 * @namespace TRAVISO
 */
export * from './version';
export * from './map/EngineView';
export { TileView } from './map/TileView';
export * from './utils/hello';
export * from './utils/trace';
export { TColumnRowPair, TPositionPair } from './utils/map';

/**
 * Global configuration settings for traviso
 *
 * @property
 * @protected
 * @internal
 */
let config: TTravisoConfiguration = {
    logEnabled: false,
};

/**
 * Flag defining whether traviso is set or not
 *
 * @property
 * @protected
 * @internal
 */
let isReady: boolean = false;

/**
 * Initializes traviso global settings if it hasn't been already.
 *
 * @method
 * @function
 * @internal
 * 
 * @param globalConfig {TTravisoConfiguration} configuration object for the traviso engine
 */
const init = (globalConfig: TTravisoConfiguration): void => {
    // do necessary checks and assignments for global settings
    if (globalConfig) {
        config = {
            ...config,
            ...globalConfig,
        };
        config.logEnabled = enableDisableLogging(globalConfig.logEnabled);
    }
    if (isReady) {
        return;
    }
    isReady = true;
    sayHello();
    trace('Traviso initiated. (Version: ' + VERSION + ')');
};

/**
 * Creates and returns an isometric engine instance with the provided configuration.
 * Also initializes traviso global settings if it hasn't been already.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 * 
 * @method
 * @function
 * @public
 * @static
 * 
 * @param instanceConfig {TEngineConfiguration} Configuration object for the isometric instance, required
 * @param globalConfig {TTravisoConfiguration} Configuration object for the traviso engine, default null
 * 
 * @returns {EngineView} A new instance of the isometric engine
 */
export const getEngineInstance = (
    instanceConfig: TEngineConfiguration,
    globalConfig: TTravisoConfiguration = null
): EngineView => {
    init(globalConfig);
    return new EngineView(instanceConfig);
};

export {};
