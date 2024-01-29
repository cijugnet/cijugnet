# CIJUG
Simple website for CIJUG with links and redirects to X, LinkedIn, and Meetup pages.

We have a Github workflow `config.yml` which has triggers on certain files under paths.
For development, you can modify the branches which these triggers go off of to have Github actions run after pushes to that branch rather than only to main branch.

In the workflow it configures AWS Credentials and runs CDK commands to deploy materials we have in the cdk directory. 

The `CDK` Directory includes a stack for the S3 bucket which allows public access, designates the website index document (index.html), a resource policy, as well as uploads all files from app/ to the S3 bucket.

The `APP` Directory hosts the HTML files for the Static website, containing some links to the CIJUG X, LinkedIn, and Meetup page.
