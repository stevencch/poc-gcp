import { Test } from '@nestjs/testing';
import { CloudEventService, CloudEventTypes } from './cloudevents.service';
import { ValidatorService } from '../validator';
import { SchemaKey } from '../schemas';

describe('CloudEventService', () => {
  let cloudEventService: CloudEventService;

  const mockValidate = jest.fn();

  const mockEvent = {
    id: '123',
    source: 'foo',
    specversion: '1.0',
    type: CloudEventTypes.MockImportEvent,
    datacontenttype: 'application/json',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CloudEventService,
        {
          provide: ValidatorService,
          useValue: {
            validate: mockValidate,
          },
        },
      ],
    }).compile();

    cloudEventService = moduleRef.get<CloudEventService>(CloudEventService);
  });

  it('extracts data from valid cloud event', () => {
    const testData = {
      foo: 'bar',
    };
    const event = {
      ...mockEvent,
      data: JSON.stringify(testData),
    };
    mockValidate.mockReturnValue(true);

    const result = cloudEventService.extractData(
      event,
      CloudEventTypes.MockImportEvent
    );

    expect(result).toEqual(testData);
    expect(mockValidate).toHaveBeenCalledWith(SchemaKey.Mock, testData);
  });

  it('throws error when event type does not match', () => {
    const event = {
      ...mockEvent,
      type: 'com.example.unknown',
      data: JSON.stringify({ foo: 'bar' }),
    };

    expect(() =>
      cloudEventService.extractData(event, CloudEventTypes.MockImportEvent)
    ).toThrow('Invalid event type: com.example.unknown');
  });

  it('throws error when schema not found for event type', () => {
    const event = {
      ...mockEvent,
      type: 'com.example.unknown',
      data: JSON.stringify({ foo: 'bar' }),
    };

    expect(() =>
      cloudEventService.extractData(event, 'com.example.unknown' as never)
    ).toThrow('Schema not found for event type: com.example.unknown');
  });

  it('throws error when data is missing in cloud event', () => {
    const event = {
      ...mockEvent,
    };

    expect(() =>
      cloudEventService.extractData(event, CloudEventTypes.MockImportEvent)
    ).toThrow('Missing data attribute in CloudEvent');
  });

  it('throws error when payload format is invalid', () => {
    const event = {
      ...mockEvent,
      data: JSON.stringify({ foo: 'bar' }),
    };
    mockValidate.mockReturnValue(false);

    expect(() =>
      cloudEventService.extractData(event, CloudEventTypes.MockImportEvent)
    ).toThrow('Invalid payload format');
  });
});
