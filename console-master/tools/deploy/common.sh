
export S3_BUCKET=${S3_BUCKET:-ues-r00.cs.labs.blackberry.com}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-us-east-1}

src_root="${S3_SYNC_SRCDIR:-prod}/$src_dir"
s3env=${S3_TARGET_ENV:-dev}
export dest_root="s3://${S3_BUCKET}/${SITE:-console}/$s3env"
export dest_config_root="s3://${S3_BUCKET}/config"
export dest="${dest_root}/uc"
export dest_api="${dest}/api"
export flags="${DEPLOY_FLAGS:-}"
export flags_sync="${flags} ${DEPLOY_FLAGS_SYNC:-}"
export commit_branch=${CI_COMMIT_BRANCH:-}

set -x
