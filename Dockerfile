FROM n8nio/n8n:1.91.3

USER root

# Create n8n data directory
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n

USER node

# Copy autopinger if you have one
COPY --chown=node:node autopinger.js /autopinger.js

EXPOSE 5678

CMD ["n8n"]
