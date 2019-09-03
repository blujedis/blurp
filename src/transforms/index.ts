import { createModifier, createFormatter } from '../create';
import extendTransform, { IExtendTransformOptions } from './modifiers/extend';
import colorizeTransform, { IColorizeTransformOptions } from './modifiers/colorize';
import alignTransform, { IAlignTransformOptions } from './modifiers/align';
import caseTransform, { ICaseTransformOptions } from './modifiers/case';
import maskTransform, { IMaskTransformOptions } from './modifiers/mask';
import padTransform, { IPadTransformOptions } from './modifiers/pad';
import traceTransform, { ITraceTransformOptions } from './modifiers/trace';
import sortTransform, { ISortTransformOptions } from './modifiers/sort';
import delimitedFormat, { IDelimitedFormatOptions } from './formats/delimited';
import jsonFormat, { IJsonFormatOptions } from './formats/json';
import genericTransform, { GenericTransformOptions } from './modifiers/generic';
import terminalFormat, { ITerminalFormatOptions } from './stacks/terminal';
import prettyFormat, { IPrettyFormatOptions } from './formats/pretty';
import metaTransform, { IMetaTransformOptions } from './modifiers/meta';
import splatTransform, { ISplatTransformOptions } from './modifiers/splat';
import labelTransform, { ILabelTransformOptions } from './modifiers/label';
import timestampTransform, { ITimestampTransformOptions } from './modifiers/timestamp';
import errorifyTransform, { IErrorifyTransformOptions } from './modifiers/errorify';
import { DefaultLevels } from 'types';
import privateTransform, { IPrivateTransformOptions } from './modifiers/private';
import fileFormat, { IFileFormatOptions } from './stacks/file';

export * from './modifiers/align';
export * from './modifiers/case';
export * from './modifiers/colorize';
export * from './modifiers/extend';
export * from './modifiers/meta';
export * from './modifiers/generic';
export * from './modifiers/mask';
export * from './modifiers/pad';
export * from './modifiers/sort';
export * from './modifiers/trace';
export * from './modifiers/meta';

export * from './modifiers/splat';
export * from './modifiers/label';
export * from './modifiers/timestamp';
export * from './modifiers/errorify';

export * from './formats/pretty';
export * from './formats/delimited';
export * from './formats/json';
export * from './stacks/terminal';

/**
 * Initialize Transform Helpers.
 */
export function initTransforms<L extends string = any>() {

  const json = createFormatter<L, IJsonFormatOptions>(jsonFormat);
  const terminal = createFormatter<L, ITerminalFormatOptions>(terminalFormat);

  const modifier = {

    // Modifier Transforms
    align: createModifier<L, IAlignTransformOptions>(alignTransform),
    casing: createModifier<L, ICaseTransformOptions>(caseTransform),
    colorize: createModifier<L, IColorizeTransformOptions<L>>(colorizeTransform),
    extend: createModifier<L, IExtendTransformOptions>(extendTransform),
    meta: createModifier<L, IMetaTransformOptions>(metaTransform),
    generic: createModifier<L, GenericTransformOptions<L>>(genericTransform),
    mask: createModifier<L, IMaskTransformOptions>(maskTransform),
    pad: createModifier<L, IPadTransformOptions>(padTransform),
    sort: createModifier<L, ISortTransformOptions>(sortTransform),
    trace: createModifier<L, ITraceTransformOptions>(traceTransform),
    timestamp: createModifier<L, ITimestampTransformOptions>(timestampTransform),
    errorify: createModifier<L, IErrorifyTransformOptions>(errorifyTransform),
    label: createModifier<L, ILabelTransformOptions>(labelTransform),
    splat: createModifier<L, ISplatTransformOptions>(splatTransform),
    private: createModifier<L, IPrivateTransformOptions<L>>(privateTransform),

  };

  const format = {

    // Formatter Transforms
    delimited: createFormatter<L, IDelimitedFormatOptions>(delimitedFormat),
    pretty: createFormatter<L, IPrettyFormatOptions>(prettyFormat),
    json,
    JSON: json
  };

  const stack = {
    file: createFormatter<L, IFileFormatOptions>(fileFormat),
    terminal,
    console: terminal
  };

  return {
    modifier,
    format,
    stack
  };

}

export const transforms = initTransforms();
