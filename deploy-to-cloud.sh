#!/bin/sh
# This script manually triggers a Cloud Build and deploys to Cloud Run.
# Use this for "direct" updates from your local machine.

echo "🚀 Starting deployment to Google Cloud Run..."

# Set project ID if not already set
PROJECT_ID=$(gcloud config get-value project)
echo "Using Project ID: $PROJECT_ID"

# Trigger the build and deploy using the cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml --project $PROJECT_ID --quiet

echo "✅ Deployment complete!"
gcloud run services describe norinly --platform managed --region us-central1 --format 'value(status.url)'
