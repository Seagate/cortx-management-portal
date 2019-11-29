#!/usr/bin/env python3

"""
 ****************************************************************************
 Filename:          s3.py
 Description:       Contains the implementation of S3 plugin.

 Creation Date:     10/30/2019
 Author:            Alexander Nogikh

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 ****************************************************************************
"""

import asyncio
import boto
import boto3
from botocore.exceptions import ClientError
from functools import partial
from enum import Enum
from concurrent.futures import ThreadPoolExecutor
from typing import Union, List
from boto.iam.connection import IAMConnection
from boto.s3.connection import S3Connection, OrdinaryCallingFormat
from boto.connection import DEFAULT_CA_CERTS_FILE
from boto import config as boto_config
from csm.common.log import Log
from csm.common.errors import CsmInternalError
from csm.core.data.models.s3 import (S3ConnectionConfig, IamAccount, ExtendedIamAccount,
                                     IamLoginProfile, IamUser, IamUserListResponse,
                                     IamAccountListResponse, IamTempCredentials,
                                     IamErrors, IamError)


class BaseClient:
    """
    Base class for IAM API operations.
    """

    def __init__(self, access_key: str, secret_key: str, config: S3ConnectionConfig,
                 loop=asyncio.get_event_loop(), session_token=None):
        self._loop = loop
        self._executor = ThreadPoolExecutor()
        self._config = config
        self.connection = self._create_boto_connection(access_key, secret_key,
                                                       config, session_token)

    def _create_boto_connection_object(self, **kwargs):
        raise NotImplementedError

    def _create_boto_connection(self, access_key, secret_key, config: S3ConnectionConfig,
                                session_token=None):
        """
        Helper function that creates IAM connection for the given credentials and configuration
        :returns: an IAMConnection object
        """

        # Here we're overwriting the global boto config parameters.
        # In our case, these parameters are only important at the IAMConnection creation
        # So it will not affect other connections
        ca_cert = DEFAULT_CA_CERTS_FILE
        if config.ca_cert_file:
            ca_cert = config.ca_cert_file

        if not boto_config.has_section('Boto'):
            boto_config.add_section('Boto')

        boto_config.set('Boto', 'ca_certificates_file', ca_cert)

        conn = self._create_boto_connection_object(aws_access_key_id=access_key,
                                                   aws_secret_access_key=secret_key,
                                                   host=config.host,
                                                   port=config.port,
                                                   is_secure=config.use_ssl,
                                                   debug=(2 if config.debug else 0),
                                                   validate_certs=config.verify_ssl_cert,
                                                   security_token=session_token
                                                   )

        if config.max_retries_num:
            conn.num_retries = config.max_retries_num
        return conn

    async def _run_async(self, function):
        return await self._loop.run_in_executor(self._executor, function)

    def _parse_body(self, body, list_marker=None) -> dict:
        if not body:
            return {}

        if not list_marker:
            list_marker = 'Set'

        element = boto.jsonresponse.Element(list_marker=list_marker, pythonize_name=False)
        handler = boto.jsonresponse.XmlHandler(element, None)
        handler.parse(body)
        return element

    async def _query_conn(self, action, params, path, verb, list_marker=None):
        def _execute():
            return self.connection.make_request(action, params, path, verb)

        try:
            response = await self._run_async(_execute)
            body = response.read()
            Log.debug('%s responded with %s status', self._config.host, response.status)
            return (response.status, self._parse_body(body, list_marker))
        except Exception as e:
            raise e  # TODO: create some custom exception for this?

    def _create_response(self, cls, data, mapping):
        """
        Creates an instance of type `cls` and fills its fields
        according to mapping
        :returns: an instance of `cls` type
        """

        resp = cls()
        for key in mapping:
            setattr(resp, mapping[key], data[key])

        return resp

    def _create_error(self, body) -> IamError:
        """
        Converts a body of a failed query into IamError object
        """
        if 'ErrorResponse' not in body:
            return None

        body = body['ErrorResponse']
        if 'Error' not in body:
            return None

        iam_error = IamError()
        iam_error.error_code = IamErrors(body['Error']['Code'])
        iam_error.error_message = body['Error']['Message']
        return iam_error


class IamClient(BaseClient):
    """
    A management object that alows to perform IAM management operations
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.EXT_ACCOUNT_MAPPING = {
            'AccountId': 'account_id',
            'CanonicalId': 'canonical_id',
            'AccountName': 'account_name',
            'AccessKeyId': 'access_key_id',
            'RootSecretKeyId': 'secret_key_id',
            'Status': 'status'
        }

        self.ACCOUNT_MAPPING = {
            'AccountId': 'account_id',
            'CanonicalId': 'canonical_id',
            'AccountName': 'account_name',
            'Email': 'account_email'
        }

        self.LOGIN_PROFILE_MAPPING = {
            'AccountName': 'account_name',
            'PasswordResetRequired': 'password_reset_required',
            'CreateDate': 'create_date'
        }

        self.IAM_USER_MAPPING = {
            'Path': 'path',
            'UserName': 'user_name',
            'UserId': 'user_id',
            'Arn': 'arn'
        }

    def _create_boto_connection_object(self, **kwargs):
        return IAMConnection(**kwargs)

    @Log.trace_method(Log.DEBUG)
    async def create_account(self, account_name: str,
                             account_email: str) -> Union[ExtendedIamAccount, IamError]:
        """
        IAM Account creation. This operation is not present in Amazon IAM API.
        In order to perform this operation, LDAP credentials must be provided into
        the class constructor.

        :returns: ExtendedIamAccount in case of success, IamError otherwise
        """
        params = {
            'AccountName': account_name,
            'Email': account_email
        }

        (code, body) = await self._query_conn('CreateAccount', params, '/', 'POST')
        if code != 201:
            return self._create_error(body)
        else:
            account = body['CreateAccountResponse']['CreateAccountResult']['Account']
            resp = self._create_response(ExtendedIamAccount, account, self.EXT_ACCOUNT_MAPPING)

            # For some strange reason there is no email field in the server response
            resp.account_email = account_email

            return resp

    @Log.trace_method(Log.DEBUG, exclude_args=['account_password'])
    async def create_account_login_profile(self, account_name, account_password,
                                           require_reset=False) -> Union[IamLoginProfile, IamError]:
        """
        Login profile creation.
        Note that it is required to provide S3 account credentials, not LDAP ones.

        :returns: IamLoginProfile in case of success, IamError otherwise
        """

        params = {
            'AccountName': account_name,
            'Password': account_password,
            'PasswordResetRequired': require_reset
        }

        (code, body) = await self._query_conn('CreateAccountLoginProfile', params, '/', 'POST')
        if code != 201:
            return self._create_error(body)
        else:
            profile = body['CreateAccountLoginProfileResponse']['CreateAccountLoginProfileResult']
            profile = profile['LoginProfile']
            return self._create_response(IamLoginProfile, profile, self.LOGIN_PROFILE_MAPPING)

    @Log.trace_method(Log.DEBUG, exclude_args=['account_password'])
    async def update_account_login_profile(self, account_name, account_password,
                                           require_reset=False) -> Union[bool, IamError]:
        """
        Login profile update.
        Note that it is required to provide S3 account credentials, not LDAP ones.

        :returns: True in case of success, IamError otherwise
        """

        params = {
            'AccountName': account_name,
            'Password': account_password,
            'PasswordResetRequired': require_reset
        }

        (code, body) = await self._query_conn('UpdateAccountLoginProfile', params, '/', 'POST')
        if code != 200:
            return self._create_error(body)
        else:
            return True

    @Log.trace_method(Log.DEBUG)
    async def list_account_login_profiles(self, account_name) -> Union[bool, IamError]:
        """
        Login profile update.
        Note that it is required to provide S3 account credentials, not LDAP ones.

        :returns: True in case of success, IamError otherwise
        """

        params = {
            'AccountName': account_name
        }

        (code, body) = await self._query_conn('GetAccountLoginProfile', params, '/', 'POST')
        print(body)
        if code != 200:
            return self._create_error(body)
        else:
            return True

    @Log.trace_method(Log.DEBUG)
    async def list_accounts(self, max_items=None,
                            marker=None) -> Union[IamAccountListResponse, IamError]:
        """
        Fetches the list of S3 accounts from the IAM server.
        Note that max_items and marker parameters are not supported yet!

        :returns: IamAccountListResponse or IamError
        """
        params = {}

        if marker:
            params['Marker'] = marker

        if max_items:
            params['MaxItems'] = max_items

        (code, body) = await self._query_conn('ListAccounts', params, '/', 'POST',
                                              list_marker='Accounts')
        if code != 200:
            return self._create_error(body)
        else:
            users = body['ListAccountsResponse']['ListAccountsResult']['Accounts']
            converted_accounts = []
            for raw_user in users:
                converted_accounts.append(self._create_response(IamAccount, raw_user,
                                                                self.ACCOUNT_MAPPING))

            resp = IamAccountListResponse()
            resp.iam_accounts = converted_accounts
            raw = body['ListAccountsResponse']['ListAccountsResult']['IsTruncated']

            resp.is_truncated = raw == 'true'
            if resp.is_truncated:
                resp.marker = body['ListAccountsResponse']['ListAccountsResult']['Marker']

            return resp

    @Log.trace_method(Log.DEBUG)
    async def reset_account_access_key(self, account_name) -> Union[ExtendedIamAccount, IamError]:
        """
        Reset access and secret key

        :returns: ExtendedIamAccount in case of success, IamError otherwise
        """
        params = {
            'AccountName': account_name
        }

        (code, body) = await self._query_conn('ResetAccountAccessKey', params, '/', 'POST')
        if code != 201:
            return self._create_error(body)
        else:
            result = body['ResetAccountAccessKeyResponse']['ResetAccountAccessKeyResult']
            resp = self._create_response(ExtendedIamAccount, result['Account'],
                self.EXT_ACCOUNT_MAPPING)

            # TODO: find out why there is no email the response
            return resp

    @Log.trace_method(Log.DEBUG)
    async def delete_account(self, account_name, force=False) -> Union[bool, IamError]:
        """
        Note that in order to delete account_name we need to use access key
        and secret key of account_name

        :returns: True in case of success, IamError in case of problem
        """
        params = {
            'AccountName': account_name
        }

        if force:
            params['Force'] = True

        (code, body) = await self._query_conn('DeleteAccount', params, '/', 'POST')
        if code != 200:
            return self._create_error(body)
        else:
            return True

    @Log.trace_method(Log.DEBUG)
    async def create_user(self, user_name, path='/') -> Union[IamUser, IamError]:
        """
        Create an IAM user.

        :returns: IamUser in case of success, IamError otherwise
        """
        params = {
            'UserName': user_name,
            'Path': path
        }

        (code, body) = await self._query_conn('CreateUser', params, '/', 'POST')
        if code != 201:
            return self._create_error(body)
        else:
            user = body['CreateUserResponse']['CreateUserResult']['User']
            return self._create_response(IamUser, user, self.IAM_USER_MAPPING)

    @Log.trace_method(Log.DEBUG, exclude_args=['user_password'])
    async def create_user_login_profile(self, user_name, user_password, require_reset=False):
        # TODO: server returns OperationNotSupported. Why??

        params = {
            'UserName': user_name,
            'Password': user_password,
            'PasswordResetRequired': require_reset
        }

        (code, body) = await self._query_conn('CreateUserLoginProfile', params, '/', 'POST')
        if code != 201:
            return self._create_error(body)
        else:
            return None

    @Log.trace_method(Log.DEBUG)
    async def list_users(self, path_prefix=None, marker=None,
                         max_items=None) -> Union[IamUserListResponse, IamError]:
        """
        Note that max_items and marker are not working for now!!

        :returns: IamUserListResponse in case of success, IamError otherwise
        """
        params = {}
        if path_prefix:
            params['PathPrefix'] = path_prefix

        if marker:
            params['Marker'] = marker

        if max_items:
            params['MaxItems'] = max_items

        (code, body) = await self._query_conn('ListUsers', {}, '/', 'POST', list_marker='Users')
        if code != 200:
            return self._create_error(body)
        else:
            users = body['ListUsersResponse']['ListUsersResult']['Users']
            converted_users = []
            for raw in users:
                converted_users.append(self._create_response(IamUser, raw, self.IAM_USER_MAPPING))

            resp = IamUserListResponse()
            resp.iam_users = converted_users
            raw = body['ListUsersResponse']['ListUsersResult']['IsTruncated']

            resp.is_truncated = raw == 'true'
            if resp.is_truncated:
                resp.marker = body['ListUsersResponse']['ListUsersResult']['Marker']

            return resp

    @Log.trace_method(Log.DEBUG)
    async def delete_user(self, user_name) -> Union[bool, IamError]:
        """
        IAM user deletion.
        :returns: True in case of success, IamError in case of problem
        """
        params = {
            'UserName': user_name
        }

        (code, body) = await self._query_conn('DeleteUser', params, '/', 'POST')
        if code != 200:
            return self._create_error(body)
        else:
            return True

    @Log.trace_method(Log.DEBUG)
    async def get_user(self, user_name) -> Union[IamUser, IamError]:
        """
        Queries a single IAM user.

        TODO: Currently is not supported by our IAM server.
        :returns: IamUser in case of success, IamError in case of problem
        """
        raise NotImplementedError()

        params = {
            'UserName': user_name
        }

        (code, body) = await self._query_conn('GetUser', params, '/', 'POST')
        if code != 200:
            return self._create_error(body)
        else:
            return None

    @Log.trace_method(Log.DEBUG)
    async def update_user(self, user_name, new_path=None,
                          new_user_name=None) -> Union[bool, IamError]:
        """
        Update an existing IAM user.

        :param user_name: TODO: find out details about this field
        :param new_path: If not None, user's path will be set to this value
        :param new_user_name: If not None, user will be renamed accordingly
        :returns: True in case of success, IamError in case of problem
        """
        params = {
            'UserName': user_name
        }

        if new_path:
            params['NewPath'] = new_path

        if new_user_name:
            params['NewUserName'] = new_user_name

        (code, body) = await self._query_conn('UpdateUser', params, '/', 'POST')
        if code != 200:
            return self._create_error(body)
        else:
            # TODO: our IAM server does not return the updated user information
            return True


class S3Client(BaseClient):
    """
    Class represents S3 server connection that manages buckets
    """

    def _create_boto_connection_object(self, **kwargs):
        """Creates S3 server connection"""

        is_secure = kwargs.get('is_secure', False)
        proto = 'https' if is_secure else 'http'
        url = f"{proto}://{kwargs.get('host', 'localhost')}:{kwargs.get('port', '80')}"
        s3 = boto3.resource(service_name='s3', endpoint_url=url,
                            aws_access_key_id=kwargs['aws_access_key_id'],
                            aws_secret_access_key=kwargs['aws_secret_access_key'],
                            aws_session_token=kwargs["security_token"])
        return s3

    @Log.trace_method(Log.DEBUG)
    async def create_bucket(self, bucket_name):
        """
        Create a S3 bucket using credentials passed during client creation.

        :returns: S3.Bucket
        """
        return await self._loop.run_in_executor(self._executor,
                                                partial(self.connection.create_bucket,
                                                        Bucket=bucket_name))

    @Log.trace_method(Log.DEBUG)
    async def delete_bucket(self, bucket_name: str):
        bucket = await self._loop.run_in_executor(self._executor, self.connection.Bucket, bucket_name)
        # NOTE: according to boto3 documentation all of the keys should be deleted before
        #  bucket deletion itself
        for key in bucket.objects.all():
            await self._loop.run_in_executor(self._executor, key.delete)
        
        await self._loop.run_in_executor(self._executor, bucket.delete)

    @Log.trace_method(Log.DEBUG)
    async def get_all_buckets(self):
        return await self._loop.run_in_executor(self._executor, self.connection.buckets.all)

    @Log.trace_method(Log.DEBUG)
    async def get_bucket_tagging(self, bucket):
        # When the tag_set is not available ClientError is raised
        # Need to avoid that in order to iterate over tags for all available buckets
        try:
            tagging = await self._loop.run_in_executor(self._executor, bucket.Tagging)
            tags = tagging.tag_set
        except ClientError:
            tags = []
        # Tags are stored in form [{'Key': <key value>, 'Value' : <actual value>}, ...]
        # Convert to ordinary Python dict
        res = {tag['Key'] : tag['Value'] for tag in tags}
        return res

    @Log.trace_method(Log.DEBUG)
    async def put_bucket_tagging(self, bucket_name, tags: dict):
        def _run():
            tag_set = {
                'TagSet': [
                    {
                        'Key': key,
                        'Value': tags[key]
                    } for key in tags
                ]
            }
            tagging = self.connection.BucketTagging(bucket_name)
            return tagging.put(Tagging=tag_set)
        return await self._loop.run_in_executor(self._executor, _run)


class S3Plugin:
    """
    Plugin that provides IAM-related operations implementation.

    The plugin requires an S3ConnectionConfig instance that contains the necessary
    information for IAM server access.

    Steps to use this plugin for IAM Account management:
    1. Prepare root IAM server LDAP credentials
    2. Call s3plugin.get_iam_client('ldap_login', 'ldap_password', connection_config)
       to retrieve the corresponding management object
    3. Perform API queries using that object

    Example:
        client = s3plugin.get_iam_client('ldap_login', 'ldap_pwd', connection_config)
        account_list = await client.list_accounts()

    A similar sequence of steps is required for IAM User management.
    1. Prepare access and secret key of the account on behalf of which you are going to
       manage IAM Users
    2. Call s3plugin.get_iam_client('access_key', 'secret_ey', connection_config)
       to retrieve the corresponding management object
    3. Perform API queries using that object

    In order to authenticate via some Login Profile it is sufficient to only call
    the get_temp_credentials function, e.g.
        creds = await s3plugin.get_temp_credentials('login', 'pwd', connection_config=config)
    """
    def __init__(self):
        Log.info('S3 plugin is loaded')

    @Log.trace_method(Log.DEBUG, exclude_args=['secret_key'])
    def get_iam_client(self, access_key, secret_key, connection_config=None, session_token=None) -> IamClient:
        """
        Returns a management object for S3/IAM accounts.
        """
        if not connection_config:
            raise CsmInternalError('Connection configuration must be provided')

        return IamClient(access_key, secret_key, connection_config,
                         asyncio.get_event_loop(), session_token)

    @Log.trace_method(Log.DEBUG, exclude_args=['secret_key'])
    def get_s3_client(self, access_key, secret_key, connection_config=None, session_token=None) -> S3Client:
        """
        Returns a management object for S3/IAM accounts.
        """
        if not connection_config:
            raise CsmInternalError('Connection configuration must be provided')

        return S3Client(access_key, secret_key, connection_config,
                        asyncio.get_event_loop(), session_token)


    @Log.trace_method(Log.DEBUG)
    async def get_temp_credentials(self, account_name, password, duration=None,
                                   user_name=None, connection_config=None):
        """
        Authentication via some Login Profile
        :param account_name:
        :param password:
        :param duration: Session expiry time (in seconds). If set, it must be
                         greater than 900.
        :param user_name: TODO: find out details about this field
        :param connection_config: TODO: find out details about this field
        :returns: An instance of IamTempCredentials object
        """
        iamcli = IamClient('', '', connection_config, asyncio.get_event_loop())
        params = {
            'AccountName': account_name,
            'Password': password
        }

        if duration:
            params['Duration'] = duration
        if user_name:
            params['UserName'] = user_name

        (code, body) = await iamcli._query_conn('GetTempAuthCredentials', params, '/', 'POST')
        if code != 201:
            return iamcli._create_error(body)
        else:
            creds = body['GetTempAuthCredentialsResponse']['GetTempAuthCredentialsResult']
            return iamcli._create_response(IamTempCredentials, creds['AccessKey'], {
                'UserName': 'user_name',
                'AccessKeyId': 'access_key',
                'SecretAccessKey': 'secret_key',
                'Status': 'status',
                'ExpiryTime': 'expiry_time',
                'SessionToken': 'session_token'
            })
