#!/bin/bash
echo start init_pubsub.sh &&
sleep 20 &&
until curl http://${PUBSUB_EMULATOR_HOST}/v1/projects/${PROJECT_ID}/topics; do sleep 3; done;
gcloud pubsub topics create ${DEAD_LETTER_TOPIC} &&
gcloud pubsub subscriptions create ${STORES_PROCESSOR_DEAD_LETTER_SUBSCRIPTION} --topic=${DEAD_LETTER_TOPIC} --ack-deadline=60
