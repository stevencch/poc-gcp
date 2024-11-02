FROM google/cloud-sdk:alpine
ARG FIREBASE_VERSION=13.16.0
RUN apk --no-cache add npm openjdk11 bash curl openssl gettext nano nginx sudo
RUN npm cache clean --force && \
    npm i -g firebase-tools@$FIREBASE_VERSION
# Install ping
#RUN apk add --no-cache iputils


COPY serve.sh /usr/bin/
RUN sed -i 's/\r$//' /usr/bin/serve.sh
RUN chmod +x /usr/bin/serve.sh
WORKDIR /srv/firebase


# Run ping to keep the container alive and continuously ping a host (e.g., google.com)
#CMD ["ping", "google.com"]
#HEALTHCHECK --interval=10s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:4000 || ex

# @todo: run as non-root user
ENTRYPOINT ["/usr/bin/serve.sh"]
