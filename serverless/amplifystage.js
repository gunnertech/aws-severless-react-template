const awsconfig = require("./amplifyconfig")



module.exports.stage = () => {
  return awsconfig.env().aws_user_files_s3_bucket.split('-').reverse()[0]
}