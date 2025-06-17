```
kubectl create namespace testing
```

```
# Create the main secrets
kubectl create secret generic bc-wallet-secrets \
  -n testing \
  --from-literal=API_KEY='Your API key' \
  --from-literal=ENCRYPTION_KEY='Your Encryption key' \
  --from-literal=OIDC_ROOT_CLIENT_ID='Your OIDC Root Client ID' \
  --from-literal=OIDC_ROOT_CLIENT_SECRET='Your OIDC Root client secret' \
  --from-literal=OIDC_ROOT_ISSUER_URL='Your OIDC Root issuer URL' \
  --from-literal=OIDC_TRUST_HOST='Your OIDC trust host' \
  --from-literal=OIDC_DEFAULT_TENANT='Your OIDC default tenant ID' \
  --from-literal=NEXT_AUTH_SECRET='Your Next Auth secret' \
  --from-literal=TRACTION_API_URL='Your Traction API URL' \
  --from-literal=TRACTION_WEBHOOK_SECRET='Your Traction webhook secret' \
  --from-literal=WALLET_ID='Your Wallet ID'

# Create PostgreSQL password secret
kubectl create secret generic postgresql-password \
  -n testing \
  --from-literal=postgres-password='Your PostgreSQL Password'

# Create RabbitMQ password secret
kubectl create secret generic rabbitmq-password \
  -n testing \
  --from-literal=rabbitmq-password='Your RabbitMQ Password'
```