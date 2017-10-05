FROM nginx:1.11

RUN apt-get clean all && apt-get update && apt-get upgrade -y --no-install-recommends \
  && apt-get install -y --no-install-recommends dnsutils

RUN rm /etc/nginx/conf.d/*.conf

WORKDIR /usr/src

COPY nginx.conf /etc/nginx/

CMD ["nginx"]