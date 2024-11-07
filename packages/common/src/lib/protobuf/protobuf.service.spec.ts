import { Test, TestingModule } from '@nestjs/testing';
import * as protobuf from 'protobufjs';
import {
  ProtobufKey,
  ProtobufService,
  ProtobufSchemaType,
} from './protobuf.service';

jest.mock('protobufjs', () => ({
  loadSync: jest.fn().mockReturnValue({
    root: {
      lookupType: jest
        .fn()
        .mockReturnValue({ encode: jest.fn(), decode: jest.fn() }),
    },
  }),
}));

describe('ProtobufService', () => {
  let service: ProtobufService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtobufService],
    }).compile();

    service = module.get<ProtobufService>(ProtobufService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should load all schemas in the config', () => {
    expect(service['schemas']).toBeDefined();

    expect(Object.keys(service['schemaConfig']).length).toBeGreaterThan(0);

    Object.entries(service['schemaConfig']).forEach(([key, value]) => {
      expect(protobuf.loadSync).toHaveBeenCalledWith(
        expect.stringContaining(value.file)
      );
      expect(service['schemas'][key]).toBeDefined();
    });
  });

  it('should call protobufjs decode correctly', () => {
    const schema = ProtobufKey.MockEventMessage;
    const data = Buffer.from('test');

    const mockMsg = {
      $type: { toObject: jest.fn().mockReturnValue({}) },
    } as unknown as protobuf.Message;

    const decodeSpy = jest
      .spyOn(service['schemas'][schema], 'decode')
      .mockReturnValue(mockMsg);

    const decodedData = service.decode(schema, data);

    expect(decodeSpy).toHaveBeenCalledWith(data);
    expect(mockMsg.$type.toObject).toHaveBeenCalled();

    expect(decodedData).toBeDefined();
  });

  it('should call protobufjs encode correctly', () => {
    const schema = ProtobufKey.MockEventMessage;
    const data = {
      test: 'test',
    } as unknown as ProtobufSchemaType[ProtobufKey.MockEventMessage];

    const mockMsg = {
      finish: jest.fn().mockReturnValue(new Uint8Array()),
    } as unknown as protobuf.Writer;

    const encodeSpy = jest
      .spyOn(service['schemas'][schema], 'encode')
      .mockReturnValue(mockMsg);

    const encodedData = service.encode(schema, data);

    expect(encodeSpy).toHaveBeenCalledWith(data);
    expect(mockMsg.finish).toHaveBeenCalled();

    expect(encodedData).toBeDefined();
  });
});
