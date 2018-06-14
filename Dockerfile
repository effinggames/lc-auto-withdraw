FROM gliderlabs/herokuish:v0.3.36

RUN mkdir -p /app
ADD . /app
RUN /build

RUN /exec npm run build 

ENTRYPOINT ["/exec", "npm", "start"]