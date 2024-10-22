FROM node:19-bullseye

WORKDIR /usr/app

COPY ./package.json ./
RUN npm install

# Delete node_modules before building image
COPY ./ ./

# RUN python -m venv /opt/venv
# ENV PATH="/opt/venv/bin:$PATH"
RUN apt-get update || : && apt-get install python3-pip -y
RUN pip install -r ./python/requirements.txt

CMD ["npm", "run", "start"]
