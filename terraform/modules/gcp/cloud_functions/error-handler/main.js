/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(6), exports);
tslib_1.__exportStar(__webpack_require__(11), exports);
tslib_1.__exportStar(__webpack_require__(7), exports);
tslib_1.__exportStar(__webpack_require__(14), exports);
tslib_1.__exportStar(__webpack_require__(18), exports);
tslib_1.__exportStar(__webpack_require__(26), exports);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const protobuf_1 = __webpack_require__(7);
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [protobuf_1.ProtobufService,],
        exports: [protobuf_1.ProtobufService,],
    })
], CommonModule);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(8), exports);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProtobufService = exports.ProtobufKey = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const protobuf = tslib_1.__importStar(__webpack_require__(9));
const path = tslib_1.__importStar(__webpack_require__(10));
var ProtobufKey;
(function (ProtobufKey) {
    ProtobufKey["MockEventMessage"] = "MockEventMessage";
    ProtobufKey["CloudEventMessage"] = "CloudEventMessage";
    ProtobufKey["EventRouterMessage"] = "EventRouterMessage";
})(ProtobufKey || (exports.ProtobufKey = ProtobufKey = {}));
let ProtobufService = class ProtobufService {
    constructor() {
        this.schemas = {};
        this.schemaConfig = {
            [ProtobufKey.MockEventMessage]: {
                file: 'mockEventMessage.proto',
                messageType: 'MockEventMessage',
            },
            [ProtobufKey.CloudEventMessage]: {
                file: 'cloudEvent.proto',
                messageType: 'CloudEvent',
            },
            [ProtobufKey.EventRouterMessage]: {
                file: 'eventRouterMessage.proto',
                messageType: 'google.events.cloud.firestore.v1.DocumentEventData',
            },
        };
        this.loadSchemas();
    }
    loadSchemas() {
        function getSchemaPath(schemaFile) {
            return path.join(__dirname, 'assets', 'proto', `${schemaFile}`);
        }
        Object.entries(this.schemaConfig).forEach(([key, value]) => {
            const loadedSchema = protobuf.loadSync(getSchemaPath(value.file));
            this.schemas[key] = loadedSchema.root.lookupType(value.messageType);
        });
    }
    decode(schema, data) {
        const decodedData = this.schemas[schema].decode(data);
        // TODO: Support integers larger than 53bit
        return decodedData.$type.toObject(decodedData, { longs: Number });
    }
    encode(schema, data) {
        const encodedData = this.schemas[schema].encode(data).finish();
        return Buffer.from(encodedData);
    }
};
exports.ProtobufService = ProtobufService;
exports.ProtobufService = ProtobufService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], ProtobufService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("protobufjs");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(12), exports);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudEventService = exports.CloudEventTypes = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const cloudevents_1 = __webpack_require__(13);
const schemas_1 = __webpack_require__(14);
var CloudEventTypes;
(function (CloudEventTypes) {
    CloudEventTypes["MockImportEvent"] = "com.cwretail.catalogue.mock.update.v1";
    CloudEventTypes["NewAdminImportEvent"] = "com.cwretail.catalogue.newadmin.update.v1";
    CloudEventTypes["ProductInformationImportEvent"] = "com.cwretail.catalogue.productinformation.update.v1";
    CloudEventTypes["PimsImportEvent"] = "com.cwretail.catalogue.pims.update.v1";
    CloudEventTypes["OutboxEvent"] = "com.cwretail.catalogue.outbox.update.v1";
    CloudEventTypes["ProductWrittenEvent"] = "com.cwretail.catalogue.productwritten.update.v1";
})(CloudEventTypes || (exports.CloudEventTypes = CloudEventTypes = {}));
const cloudEventSchemaMap = new Map([
    [CloudEventTypes.MockImportEvent, schemas_1.SchemaKey.Mock],
    [CloudEventTypes.NewAdminImportEvent, schemas_1.SchemaKey.NewAdminImportPayload],
    [
        CloudEventTypes.ProductInformationImportEvent,
        schemas_1.SchemaKey.ProductInformationImportPayload,
    ],
    [CloudEventTypes.PimsImportEvent, schemas_1.SchemaKey.PimsImportPayload],
    [CloudEventTypes.OutboxEvent, schemas_1.SchemaKey.OutboxItemPayload],
]);
let CloudEventService = class CloudEventService {
    constructor() { }
    extractData(event, eventType) {
        const cloudEvent = new cloudevents_1.CloudEvent(event, true);
        if (cloudEvent.type !== eventType) {
            throw new Error(`Invalid event type: ${cloudEvent.type}`);
        }
        const schemaKey = cloudEventSchemaMap.get(eventType);
        if (!schemaKey) {
            throw new Error(`Schema not found for event type: ${cloudEvent.type}`);
        }
        if (!cloudEvent.data) {
            throw new Error('Missing data attribute in CloudEvent');
        }
        const parsedData = JSON.parse(cloudEvent.data);
        return parsedData;
    }
    static createEvent(eventType, source, data) {
        return new cloudevents_1.CloudEvent({
            type: eventType,
            source: source,
            data: JSON.stringify(data),
            datacontenttype: 'application/json',
        });
    }
};
exports.CloudEventService = CloudEventService;
exports.CloudEventService = CloudEventService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], CloudEventService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("cloudevents");

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchemaKey = void 0;
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(15), exports);
tslib_1.__exportStar(__webpack_require__(16), exports);
tslib_1.__exportStar(__webpack_require__(17), exports);
var SchemaKey;
(function (SchemaKey) {
    SchemaKey["Mock"] = "mock";
    SchemaKey["NewAdminSourceProduct"] = "newAdminSourceProduct";
    SchemaKey["NewAdminProduct"] = "newAdminProduct";
    SchemaKey["NewAdminImportPayload"] = "newAdminImportPayload";
    SchemaKey["ProductInformationSourceProduct"] = "productInformationSourceProduct";
    SchemaKey["ProductInformationProduct"] = "productInformationProduct";
    SchemaKey["ProductInformationImportPayload"] = "productInformationImportPayload";
    SchemaKey["PimsSourceProduct"] = "pimsSourceProduct";
    SchemaKey["PimsProduct"] = "pimsProduct";
    SchemaKey["PimsImportPayload"] = "pimsImportPayload";
    SchemaKey["OutboxItemPayload"] = "outboxItem";
    SchemaKey["EventRouterPayload"] = "eventRouterPayload";
})(SchemaKey || (exports.SchemaKey = SchemaKey = {}));


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createBatcher = createBatcher;
function createBatcher(batchSize) {
    let currentBatch = { number: 1, items: [] };
    const getBatch = () => structuredClone(currentBatch);
    const addToBatch = (item) => {
        currentBatch.items.push(item);
        const isFull = currentBatch.items.length === batchSize;
        if (isFull) {
            const batch = getBatch();
            currentBatch = {
                number: batch.number + 1,
                items: [],
            };
            return { isFull, batch };
        }
        return { isFull, batch: currentBatch };
    };
    return { addToBatch, getBatch };
}


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.delay = delay;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRunningLocally = isRunningLocally;
/**
 * Determines the execution environment of an app by checking for the presence of Cloud Run environment variables.
 * Cloud Run Service: (`K_SERVICE`, `K_REVISION`, and `K_CONFIGURATION`)
 * Cloud Run Job: (`CLOUD_RUN_JOB`, `CLOUD_RUN_EXECUTION`, `CLOUD_RUN_TASK_INDEX`, `CLOUD_RUN_TASK_ATTEMPT`, and `CLOUD_RUN_TASK_COUNT`)
 *
 * More information on these variables can be found here {@link https://cloud.google.com/run/docs/container-contract#env-vars}
 *
 * @returns {boolean} Returns `true` if running locally, and `false` if running in GCP Cloud Run.
 */
function isRunningLocally() {
    const cloudRunEnvVars = [
        'K_SERVICE',
        'K_REVISION',
        'K_CONFIGURATION',
        'CLOUD_RUN_JOB',
        'CLOUD_RUN_EXECUTION',
        'CLOUD_RUN_TASK_INDEX',
        'CLOUD_RUN_TASK_ATTEMPT',
        'CLOUD_RUN_TASK_COUNT',
    ];
    return !Object.keys(process.env).some((key) => cloudRunEnvVars.includes(key));
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isWithinDays = isWithinDays;
function isWithinDays(days, timestamp) {
    const currentTimestamp = Date.now();
    const lookbackMilliseconds = days * 24 * 60 * 60 * 1000;
    const difference = currentTimestamp - timestamp;
    return difference < lookbackMilliseconds;
}


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLoggingLevels = getLoggingLevels;
const common_1 = __webpack_require__(2);
function getLoggingLevels(level) {
    if (level === undefined)
        level = process.env['LOGGING_LEVEL']?.toLowerCase() || 'log';
    const levels = [
        'verbose',
        'debug',
        'log',
        'warn',
        'error',
        'fatal',
    ];
    if (!levels.includes(level)) {
        common_1.Logger.error(`Invalid LOGGING_LEVEL environment variable: "${level}". Defaulting to "log".`);
        return levels.slice(levels.indexOf('log'));
    }
    const index = levels.indexOf(level);
    return levels.slice(index);
}


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxDate = maxDate;
function maxDate(dates) {
    const validDates = dates.filter((date) => date !== null && date !== undefined);
    return new Date(Math.max(...validDates.map((date) => date.getTime())));
}


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseDateString = parseDateString;
/**
 * @param {string} dateString - Supports date format DD/MM/YY HH:mm:ss.
 */
function parseDateString(dateString) {
    const [day, month, year, hours, minutes, seconds] = dateString
        .split(/[\s/:]/)
        .map(Number);
    const date = new Date(year + 2000, month - 1, day, hours, minutes, seconds);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: "${dateString}"`);
    }
    return date;
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(27), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["EXTRACTION"] = "extraction";
    ErrorType["VALIDATION"] = "validation";
    ErrorType["PROCESSING"] = "processing";
})(ErrorType || (exports.ErrorType = ErrorType = {}));


/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorHandlerModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const error_handler_service_1 = __webpack_require__(31);
const error_handler_controller_1 = __webpack_require__(36);
const config_1 = __webpack_require__(35);
const firestore_config_1 = tslib_1.__importDefault(__webpack_require__(34));
const firestore_service_1 = __webpack_require__(32);
let ErrorHandlerModule = class ErrorHandlerModule {
};
exports.ErrorHandlerModule = ErrorHandlerModule;
exports.ErrorHandlerModule = ErrorHandlerModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [error_handler_service_1.ErrorHandlerService, firestore_service_1.FirestoreService],
        controllers: [error_handler_controller_1.ErrorHandlerController],
        imports: [
            config_1.ConfigModule.forRoot({
                load: [firestore_config_1.default],
            }),
        ],
    })
], ErrorHandlerModule);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var ErrorHandlerService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorHandlerService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const firestore_service_1 = __webpack_require__(32);
let ErrorHandlerService = ErrorHandlerService_1 = class ErrorHandlerService {
    constructor(firestoreService) {
        this.firestoreService = firestoreService;
        this.logger = new common_1.Logger(ErrorHandlerService_1.name);
    }
    async process(message) {
        this.logger.log('Processing started');
        await this.firestoreService.insertDeadLetterMessage(message);
        this.logger.log('Processing finished');
    }
};
exports.ErrorHandlerService = ErrorHandlerService;
exports.ErrorHandlerService = ErrorHandlerService = ErrorHandlerService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof firestore_service_1.FirestoreService !== "undefined" && firestore_service_1.FirestoreService) === "function" ? _a : Object])
], ErrorHandlerService);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var FirestoreService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirestoreService = exports.CollectionEnum = void 0;
const tslib_1 = __webpack_require__(1);
const firestore_1 = __webpack_require__(33);
const common_1 = __webpack_require__(2);
const firestore_config_1 = tslib_1.__importDefault(__webpack_require__(34));
const config_1 = __webpack_require__(35);
var CollectionEnum;
(function (CollectionEnum) {
    CollectionEnum["DEAD_LETTER_MESSAGES"] = "dead_letter_messages";
})(CollectionEnum || (exports.CollectionEnum = CollectionEnum = {}));
let FirestoreService = FirestoreService_1 = class FirestoreService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(FirestoreService_1.name);
    }
    async onModuleInit() {
        this.db = new firestore_1.Firestore({
            projectId: this.config.projectId,
            databaseId: this.config.databaseId,
        });
    }
    async insertDeadLetterMessage(message) {
        try {
            const deadLetterMessagesRef = this.db.collection(CollectionEnum.DEAD_LETTER_MESSAGES);
            deadLetterMessagesRef.add({
                message_id: message.messageId,
                source_subscription_id: message.attributes.CloudPubSubDeadLetterSourceSubscription,
                message,
                created: firestore_1.Timestamp.now(),
                expire_at: firestore_1.Timestamp.fromMillis(Date.now() + this.config.expiryDuration),
            });
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error while inserting dead letter message: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.FirestoreService = FirestoreService;
exports.FirestoreService = FirestoreService = FirestoreService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(firestore_config_1.default.KEY)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object])
], FirestoreService);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("@google-cloud/firestore");

/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__(35);
exports["default"] = (0, config_1.registerAs)('firestore', () => {
    const firestoreConfig = {
        projectId: process.env['PROJECT_ID'],
        databaseId: process.env['DATABASE_ID'],
        expiryDuration: (Number(process.env['EXPIRY_DURATION_DAYS']) || 30) * 24 * 60 * 60 * 1000,
    };
    return firestoreConfig;
});


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var ErrorHandlerController_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorHandlerController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const express_1 = __webpack_require__(29);
const error_handler_service_1 = __webpack_require__(31);
let ErrorHandlerController = ErrorHandlerController_1 = class ErrorHandlerController {
    constructor(errorHandlerService) {
        this.errorHandlerService = errorHandlerService;
        this.logger = new common_1.Logger(ErrorHandlerController_1.name);
    }
    async handle(req, res) {
        this.logger.log('Received request to process deadletter message');
        const body = req.body;
        try {
            await this.errorHandlerService.process(body.message);
        }
        catch (error) {
            this.logger.error(`Failed to process message: ${error.message}`);
            res
                .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .send('Failed to process message.');
            return;
        }
        return res.status(common_1.HttpStatus.OK).json({ message: 'OK' });
    }
};
exports.ErrorHandlerController = ErrorHandlerController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ErrorHandlerController.prototype, "handle", null);
exports.ErrorHandlerController = ErrorHandlerController = ErrorHandlerController_1 = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof error_handler_service_1.ErrorHandlerService !== "undefined" && error_handler_service_1.ErrorHandlerService) === "function" ? _a : Object])
], ErrorHandlerController);


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("@google-cloud/functions-framework");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(4);
const common_2 = __webpack_require__(5);
const express_1 = tslib_1.__importDefault(__webpack_require__(29));
const error_handler_module_1 = __webpack_require__(30);
const functions_framework_1 = __webpack_require__(37);
let app;
const server = (0, express_1.default)();
const port = process.env.NEST_PORT || 3003;
const host = process.env.HOST || '0.0.0.0';
async function bootstrap() {
    const loggingLevels = (0, common_2.getLoggingLevels)();
    app = await core_1.NestFactory.create(error_handler_module_1.ErrorHandlerModule, new platform_express_1.ExpressAdapter(server), {
        logger: loggingLevels,
    });
    app.enableCors();
    await app.listen(port, host);
    return app;
}
(0, functions_framework_1.http)('handler', async (req, res) => {
    app = app ?? (await bootstrap());
    await server(req, res);
});
if ((0, common_2.isRunningLocally)()) {
    bootstrap()
        .then(() => common_1.Logger.log(`Application running on port ${port}`))
        .catch((err) => console.log(err));
}

})();

/******/ })()
;