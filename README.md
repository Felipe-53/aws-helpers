# AWS Helpers

This repo comprises some utility modules to help every-day interactions with AWS resources.

## Requirements

It requires the [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to be installed and configured with credentials of a user that has access to the resources the modules aim to interact with.

## Tools

The main tool used is the aws [sdk v3](https://github.com/aws/aws-sdk-js-v3).

### aws sdk

The v3 of the asw sdk is written in TypeScript and provides type safe access to the resources, which is ideal and much better than using the command line interface and having to guess what the expected input and output formats are.
Although they can be looked-up in the docs, it becomes tiresome to do so often. The aws provides all the types for input and output in an elegant way.

### aws cli
For really simple use-cases, a wrapper around the aws cli is used.

