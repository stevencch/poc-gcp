/* THIS FILE HAS BEEN AUTO-GENERATED ON Fri, 01 Nov 2024 00:42:26 GMT */
CREATE EXTENSION IF NOT EXISTS "postgis" CASCADE;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp" CASCADE;


CREATE SCHEMA if NOT EXISTS "store";


CREATE TABLE "store"."stores" (
  "id" varchar(100),
  "channel_key" varchar(200) NOT NULL,
  "store_name" varchar(100) NOT NULL,
  "coordinates" geography (POINT) NOT NULL,
  "timezone_identifier" varchar(100) NOT NULL,
  "address_line_1" varchar(100) NOT NULL,
  "address_line_2" varchar(100) NULL,
  "city" varchar(50) NOT NULL,
  "postalcode" varchar(20) NOT NULL,
  "state" varchar(50) NOT NULL,
  "country" varchar(50) NOT NULL,
  "cc_enabled" boolean DEFAULT '0',
  "cc_activation_date" timestamptz DEFAULT NULL,
  "fd_enabled" boolean DEFAULT '0',
  "fd_activation_date" timestamptz DEFAULT NULL,
  "omni_store_enabled" boolean DEFAULT '0',
  "omni_store_activation_date" timestamptz DEFAULT NULL,
  "schedule_2" boolean DEFAULT '0',
  "schedule_3" boolean DEFAULT '0',
  "schedule_4" boolean DEFAULT '0',
  "schedule_8" boolean DEFAULT '0',
  "is_active" boolean DEFAULT '0',
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);


ALTER TABLE "store"."stores"
ADD CONSTRAINT "store_channel_key_index" UNIQUE ("channel_key");


CREATE TABLE "store"."delivery_partners" (
  "id" varchar(50),
  "name" varchar(100) NOT NULL,
  "status" boolean DEFAULT '0',
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "delivery_partners_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "store"."delivery_rates" (
  "id" UUID,
  "delivery_partner_id" varchar(50) NOT NULL,
  "fd_service_type" varchar(100) NOT NULL,
  "max_boundary_km" decimal(10, 2) NOT NULL,
  "min_boundary_km" decimal(10, 2) NOT NULL,
  "delivery_price" decimal(10, 2) NOT NULL,
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "delivery_rates_pkey" PRIMARY KEY ("id")
);


ALTER TABLE "store"."delivery_rates"
ADD CONSTRAINT "delivery_rates_delivery_partner_id_foreign" FOREIGN key ("delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


CREATE TABLE "store"."store_delivery_schedule" (
  "id" UUID,
  "store_id" varchar(255) NOT NULL,
  "fd_service_type" varchar(100) NOT NULL,
  "order_type" varchar(50) NOT NULL,
  "range" decimal(10, 2) NOT NULL,
  "is_active" boolean DEFAULT '0',
  "monday_delivery_partner_id" varchar(50) NULL,
  "tuesday_delivery_partner_id" varchar(50) NULL,
  "wednesday_delivery_partner_id" varchar(50) NULL,
  "thursday_delivery_partner_id" varchar(50) NULL,
  "friday_delivery_partner_id" varchar(50) NULL,
  "saturday_delivery_partner_id" varchar(50) NULL,
  "sunday_delivery_partner_id" varchar(50) NULL,
  "ineligible_at_schedule" integer NOT NULL,
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "store_delivery_schedule_pkey" PRIMARY KEY ("id")
);


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_store_id_foreign" FOREIGN key ("store_id") REFERENCES "store"."stores" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_monday_delivery_partner_id_foreign" FOREIGN key ("monday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_tuesday_delivery_partner_id_foreign" FOREIGN key ("tuesday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_wednesday_delivery_partner_id_foreign" FOREIGN key ("wednesday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_thursday_delivery_partner_id_foreign" FOREIGN key ("thursday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_friday_delivery_partner_id_foreign" FOREIGN key ("friday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_saturday_delivery_partner_id_foreign" FOREIGN key ("saturday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


ALTER TABLE "store"."store_delivery_schedule"
ADD CONSTRAINT "store_delivery_schedule_sunday_delivery_partner_id_foreign" FOREIGN key ("sunday_delivery_partner_id") REFERENCES "store"."delivery_partners" ("id");


CREATE SCHEMA if NOT EXISTS "marketplace";


CREATE TABLE "marketplace"."seller" (
  "id" serial PRIMARY KEY,
  "marketplace_id" integer NOT NULL,
  "name" varchar(100) NOT NULL,
  "seller_rate" decimal(10, 2) NOT NULL,
  "shipping_rate_threshold" decimal(10, 2) NOT NULL,
  "channel_key" varchar(100) NOT NULL,
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "marketplace"."seller"
ADD CONSTRAINT "seller_channel_key_index" UNIQUE ("channel_key");


CREATE TABLE "marketplace"."sku" (
  "id" serial PRIMARY KEY,
  "seller_id" integer NOT NULL,
  "marketplace_id" integer NOT NULL,
  "sku_rate" decimal(10, 2) NOT NULL,
  "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "marketplace"."sku"
ADD CONSTRAINT "sku_seller_id_foreign" FOREIGN key ("seller_id") REFERENCES "marketplace"."seller" ("id");


ALTER TABLE "marketplace"."sku"
ADD CONSTRAINT "sku_marketplace_id_index" UNIQUE ("marketplace_id");