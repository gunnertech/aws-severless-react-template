#!/bin/bash
# ./scripts/amplify/init <project name> <env> <cloudfront domain> <sentry url> <app id> 
set -e
IFS='|'



aws amplify update-app --app-id $5 \
  --name $1-$2 \
  --profile $1-$2developer \
  --platform WEB \
  --environment-variables REACT_APP_cdn="$3",REACT_APP_sentry_url="$4",REACT_APP_base_url="https://$2.$3.amplifyapp.com" \
  --enable-branch-auto-build \
  --custom-rules '[{"source":"</^[^.]+$|\\.(?!(css|json|gif|ico|jpg|js|png|txt|svg|woff|ttf)$)([^.]+$)/>","target":"/index.html","status":"200"},{"source":"/<*>","target":"/index.html","status":"404"}]'

# aws amplify create-app --name $1-$2 \
#   --profile $1-$2developer \
#   --repository https://git-codecommit.us-east-1.amazonaws.com/v1/repos/$1-$2/ \
#   --oauth-token  NA \
#   --platform WEB \
#   --environment-variables REACT_APP_cdn="$3",REACT_APP_sentry_url="$4",REACT_APP_base_url="https://$2.$3.amplifyapp.com" \
#   --enable-branch-auto-build \
#   --custom-rules '[{"source":"</^[^.]+$|\\.(?!(css|json|gif|ico|jpg|js|png|txt|svg|woff|ttf)$)([^.]+$)/>","target":"/index.html","status":"200"},{"source":"/<*>","target":"/index.html","status":"404"}]'