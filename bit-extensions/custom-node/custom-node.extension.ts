import { resolve } from 'path';
import { EnvsMain, EnvsAspect } from '@teambit/envs';
import { NodeAspect, NodeMain } from '@teambit/node';
import { ReactMain, ReactAspect } from '@teambit/react';
import type { TsCompilerOptionsWithoutTsConfig } from '@teambit/typescript';
import { jestConfig } from './jest';

export class CustomNodeExtension {
  constructor(private node: NodeMain) {}

  static dependencies: any = [EnvsAspect, NodeAspect, ReactAspect];

  static async provider([envs, node, react]: [EnvsMain, NodeMain, ReactMain]) {
    const compilerOptions: Partial<TsCompilerOptionsWithoutTsConfig> = {
      types: [resolve(__dirname, './@types/next-global.d.ts')],
    };

    const tsConfig = react.env.getTsConfig();
    const buildTsConfig = react.env.getBuildTsConfig();

    const customNodeEnv = node.compose([
      node.overrideJestConfig(jestConfig, require.resolve('jest')),
      node.overrideTsConfig(tsConfig, compilerOptions),
      node.overrideBuildTsConfig(buildTsConfig, compilerOptions),
    ]);

    envs.registerEnv(customNodeEnv);

    return new CustomNodeExtension(node);
  }
}
