import { Injectable } from '@nestjs/common';
import * as protobuf from 'protobufjs';
import { ProtobufMetadata, ProtobufSchemaKey, ProtobufSchemaType } from '../interfaces/protobuf.interface';

@Injectable()
export class ProtobufService {
  private protobufSchemas: Map<ProtobufSchemaKey, protobuf.Type> = new Map<ProtobufSchemaKey, protobuf.Type>();

  public loadProtobufSchemas(protobufSchemaMap: Map<ProtobufSchemaKey, ProtobufMetadata>) {
    Array.from(protobufSchemaMap).forEach(([key, value]) => {
      const file = `${__dirname}/assets/proto/${value.file}`;
      const root = protobuf.loadSync(file);
      const lookedUpType = root.lookupType(value.type);
      this.protobufSchemas.set(key, lookedUpType);
    });
  }

  public decodeProtobuf<K extends ProtobufSchemaKey>(key: K, buffer: Buffer): ProtobufSchemaType[K] {
    const protobufSchema = this.protobufSchemas.get(key);
    if (!protobufSchema) {
      throw new Error('Cannot find the protobuf schema to decode');
    }
    const message = protobufSchema.decode(buffer);
    return message.$type.toObject(message) as ProtobufSchemaType[K];
  }

  public encodeProtobuf<K extends ProtobufSchemaKey>(schema: K, data: ProtobufSchemaType[K]): Buffer {
    const protobufSchema = this.protobufSchemas.get(schema);
    if (!protobufSchema) {
      throw new Error('Cannot find the protobuf schema to encode');
    }
    const encodedData = protobufSchema.encode(data).finish();
    return Buffer.from(encodedData);
  }
}
