import { EngineConfiguration, EngineView } from './map/EngineView';
export declare type TravisoConfiguration = {
    logEnabled: boolean;
};
/**
 * Main TRAVISO namespace.
 *
 * @static
 * @namespace TRAVISO
 */
export * from './version';
export * from './utils/hello';
export * from './utils/trace';
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
export declare const getEngineInstance: (instanceConfig: EngineConfiguration, globalConfig?: TravisoConfiguration) => EngineView;
export {};
