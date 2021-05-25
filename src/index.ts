import { EngineConfiguration, EngineView } from './map/EngineView';
import { sayHello } from './utils/hello';
import { enableDisableLogging, trace } from './utils/trace';
import { VERSION } from './version';

export type TravisoConfiguration = {
    logEnabled: boolean;
};

/**
 * Main TRAVISO namespace.
 *
 * @static
 * @namespace TRAVISO
 */
export * from './version';
export * from './map/EngineView';
// export * from './utils/map';
export * from './utils/hello';
export * from './utils/trace';

/**
 * Global configuration settings for traviso
 *
 * @property {TravisoConfiguration} config
 * @protected
 */
let config: TravisoConfiguration = {
    logEnabled: false,
};

let isReady: boolean = false;

/**
 * Initializes traviso global settings if it hasn't been already.
 *
 * @method init
 * @for TRAVISO
 * @static
 * @param [globalConfig] {Object} configuration object for the traviso engine
 */
const init = (globalConfig: TravisoConfiguration): void => {
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
 * @method getEngineInstance
 * @for TRAVISO
 * @static
 * @param {EngineConfiguration} instanceConfig configuration object for the isometric instance
 * @param {TravisoConfiguration} [globalConfig=null] configuration object for the traviso engine
 * @return {EngineView} a new instance of the isometric engine
 */
export const getEngineInstance = (
    instanceConfig: EngineConfiguration,
    globalConfig: TravisoConfiguration = null
): EngineView => {
    init(globalConfig);
    return new EngineView(instanceConfig);
};

export {};
