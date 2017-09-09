docker run -d -p 5000:5000 \
 -v $(pwd)/ssl:/certs \
 -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.cert \
 -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
 --restart=always --name registry registry:2
