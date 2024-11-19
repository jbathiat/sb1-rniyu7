import { platform } from 'os';
import { join } from 'path';

export const getPlatformConfig = () => {
  const currentPlatform = platform();
  const sdkBasePath = join(__dirname, '../../../sdk/canon');

  switch (currentPlatform) {
    case 'win32':
      return {
        platform: 'win32' as const,
        sdkPath: join(sdkBasePath, 'win32'),
        dllPath: join(sdkBasePath, 'win32', 'EDSDK.dll')
      };
    case 'darwin':
      return {
        platform: 'darwin' as const,
        sdkPath: join(sdkBasePath, 'macos'),
        frameworkPath: join(sdkBasePath, 'macos', 'EDSDK.framework')
      };
    case 'linux':
      return {
        platform: 'linux' as const,
        sdkPath: join(sdkBasePath, 'linux'),
        libPath: join(sdkBasePath, 'linux', 'libedsdk.so')
      };
    default:
      throw new Error(`Unsupported platform: ${currentPlatform}`);
  }
};