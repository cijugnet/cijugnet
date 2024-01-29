import * as cdk from 'aws-cdk-lib';
import { AccountPrincipal, AnyPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketEncryption, ObjectOwnership, RedirectProtocol } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3ServerLogsBucket = new Bucket(this, 'cijug-server-logs-bucket', {
      bucketName: 'cijug-site-server-logs',
      encryption: BucketEncryption.S3_MANAGED,
      objectOwnership: ObjectOwnership.OBJECT_WRITER
    });

    s3ServerLogsBucket.addToResourcePolicy(
      new PolicyStatement({
        resources: [
          s3ServerLogsBucket.arnForObjects("*"),
          s3ServerLogsBucket.bucketArn
        ],
        actions: ["s3:List*", "S3:Get*"],
        principals: [new AccountPrincipal(this.account)],
      })
    );

    // const s3redirectBucket = new Bucket(this, 'cijug-redirect-bucket', {
    //   bucketName: 'cijug.net',
    //   encryption: BucketEncryption.S3_MANAGED,
    //   objectOwnership: ObjectOwnership.OBJECT_WRITER,
    //   websiteRedirect: {
    //     hostName: 'www.cijug.net',
    //     protocol: RedirectProtocol.HTTPS
    //   },
    //   blockPublicAccess: {
		//     blockPublicPolicy: false,
		//     blockPublicAcls: false,
		//     ignorePublicAcls: false,
		//     restrictPublicBuckets: false,
	  //   }
    // });

    // s3redirectBucket.addToResourcePolicy(
    //   new PolicyStatement({
    //     resources: [
    //       s3redirectBucket.arnForObjects("*"),
    //       s3redirectBucket.bucketArn
    //     ],
    //     actions: ["s3:List*", "S3:Get*"],
    //     principals: [new AnyPrincipal()],
    //   })
    // );

    const s3bucket = new Bucket(this, 'cijug-bucket', {
      bucketName: 'www.cijug.net',
      encryption: BucketEncryption.S3_MANAGED,
      websiteIndexDocument: 'index.html',
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      versioned: true,
	    blockPublicAccess: {
		    blockPublicPolicy: false,
		    blockPublicAcls: false,
		    ignorePublicAcls: false,
		    restrictPublicBuckets: false,
	    },
      serverAccessLogsBucket: s3ServerLogsBucket
    });

    s3bucket.addToResourcePolicy(
      new PolicyStatement({
        resources: [
          s3bucket.arnForObjects("*"),
          s3bucket.bucketArn
        ],
        actions: ["s3:List*", "S3:Get*"],
        principals: [new AnyPrincipal()]
      })
    );

    new BucketDeployment(this, 'cijug-bucket-deployment', {
      sources: [Source.asset('../app')],
      destinationBucket: s3bucket
    });


    
  }
}
