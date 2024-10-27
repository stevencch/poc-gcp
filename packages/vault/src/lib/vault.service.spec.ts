import { Test, TestingModule } from '@nestjs/testing';

import { VaultService } from './vault.service';
import { ConfigModule } from '@nestjs/config';
import vaultConfig from './vault.config';

const originalEnv = process.env;

jest.mock('@google-cloud/iam-credentials', () => {
  return {
    IAMCredentialsClient: jest.fn(() => ({
      signJwt: jest.fn().mockResolvedValue([{ signedJwt: 'mockedJwt' }]),
    })),
  };
});

jest.mock('node-vault', () => {
  return jest.fn().mockImplementation(() => {
    return {
      require: jest.fn().mockResolvedValue({}),
      gcpLogin: jest.fn().mockResolvedValue({}),
      read: jest.fn().mockResolvedValue({ data: { data: { key: 'value' } } }),
    };
  });
});

describe('VaultService', () => {
  let service: VaultService;
  const vaultRoleName = 'vault_role_name';
  const serviceAccountEmail = 'service_account_email';

  beforeEach(async () => {
    process.env['VAULT_MOUNT_POINT'] = 'vault_mount_point';
    process.env['VAULT_ENDPOINT'] = 'vault_endpoint';
    process.env['VAULT_NAMESPACE'] = 'vault_namespace';
    process.env['VAULT_PATH'] = 'vault_path';
    process.env['VAULT_ROLE_NAME'] = vaultRoleName;
    process.env['SERVICE_ACCOUNT_EMAIL'] = serviceAccountEmail;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(vaultConfig)],
      providers: [VaultService],
    }).compile();

    service = module.get<VaultService>(VaultService);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should generate JWT claims', () => {
    let claims = service['getJwtClaims'](vaultRoleName, serviceAccountEmail);
    claims = JSON.parse(claims);
    expect(claims).toHaveProperty('aud', `vault/${vaultRoleName}`);
    expect(claims).toHaveProperty('sub', serviceAccountEmail);
    expect(claims).toHaveProperty('exp');
  });

  it('should call IAMCredentialsClient to sign JWT', async () => {
    const claims = 'mockedClaims';
    const result = await service['callSignJwt'](claims, serviceAccountEmail);
    expect(result).toEqual('mockedJwt');
  });

  it('should get secrets from Vault - local', async () => {
    const result = await service.getVaultSecrets();
    expect(result).toEqual(process.env);
  });

  it('last step - should get secrets from Vault - cloud', async () => {
    process.env['K_SERVICE'] = 'defined';

    // Mock the response from the Vault library
    const vaultSecrets = { key: 'value' };
    const result = await service.getVaultSecrets();
    expect(result).toEqual(vaultSecrets);
  });
});
