# CORTX-Management-Portal Quickstart Guide

This guide provides a step-by-step walkthrough for getting you CORTX-Management-Portal ready.

- [1.0 Prerequisites](##10-Prerequisites)
- [1.2 1.2 Setup the Development Environment Locally](#12-Setup-the-Development-Environment-Locally)
- [1.3 Run Unit Test](#13-Run-Unit-Test)
- [1.4 Deploy the CORTX-Management-Portal on your VM](#14-Deploy-the-CORTX-Management-Portal-on-your-VM)
- [1.5 Run Cortx-Management-Portal UI](#15-Run-Cortx-Management-Portal)
- [1.6 REST API document](#16-REST-API-document)

## 1.0 Prerequisites

<details>
<summary>Before you begin</summary>
<p>
   
1. You'll need to install [CORTX-Manager](https://github.com/Seagate/blob/cortx-manager) or [Import OVA](https://github.com/Seagate/cortx/blob/main/doc/Importing_OVA_File.rst).

2. Login as a super user:
   
   `$ sudo su`

    Or 
    
    `$ sudo -s`

3. Install Node.js

   ```shell

   $ wget  https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz
   $ tar -xvf node-v12.13.0-linux-x64.tar.xz
   $ mkdir /opt/nodejs
   $ cp -r node-v12.13.0-linux-x64 /opt/nodejs/
   $ ln -s /opt/nodejs/node-v12.13.0-linux-x64/bin/node /usr/bin node
   $ ln -s /opt/nodejs/node-v12.13.0-linux-x64/bin/npm /usr/bin
   npm
   ``` 
4. Install GitHub
   
   Refer to the [Contributing to CORTX Management Portal](CONTRIBUTING.md) document to install GitHub and clone cortx-manager & dependent repositories.
 
</p>
</details>

## 1.2 Setup the Development Environment Locally

<details>
   <summary>Setup the GUI Development Environment Locally</summary>
   <p>
 
 1. Click open the UI repository link [here](https://github.com/Seagate/cortx-management-portal).
2. Clone the UI repository using this [URL](https://github.com/Seagate/cortx-management-portal.git) in new folder and run:

  ```shell

  $ git clone  https://github.com/Seagate/cortx-cortx-management-portal.git
  ```
3. Run the following command to install dependent packages:

   `\cortx-management-portal\gui` 
   
4. Run `$ npm install` or `$ npm i`:

   `\cortx-management-portal\gui` 

</p>
</details>

<details>
<summary>Setup the Web Development Environment Locally</summary>
<p>

1. Click open the UI repository link [here](https://github.com/Seagate/cortx-management-portal).
2. Clone the UI repository using this [URL](https://github.com/Seagate/cortx-management-portal.git) in new folder and run:

  ```shell

  $ git clone  https://github.com/Seagate/cortx-cortx-management-portal.git
  ```
3. Run the following command to install dependent packages:

   ` \cortx-management-portal\web`

4. Run `$ npm install` or `$ npm i`:

   ` \cortx-management-portal\web`

5. Change the proxy in the `vue.config.js` file from the GUI folder to point or access the backend REST API proxy:
 
   `http://localhost:28100` to the required server proxy: 
  
   `http://10.230.244.254:28101`

6. To connect middleware nodejs API, update the `.env` file with a few entries: 

   ```shell
     SERVER_PROTOCOL="https" change to SERVER_PROTOCOL="http" CORTX_MANAGER_HOST="localhost"
   ```
   1. Change the above to: `CORTX_MANAGEMENT_PORTAL_HOST="10.230.244.254"`
  
   2. Change the `LOG_FILE_PATH` to local directory path:
  
      `LOG_FILE_PATH="H:\\744541\\Documents\\log\\CORTX_MANAGER_middleware.log"`

      `FILE_UPLOAD_FOLDER="H:\\744541\\Documents\\frontend\\file_upload"`
    
   3. To serve the UI locally, run the below command via terminal:  
  
      `\cortx-cortx-management-portal\gui - npm run serve`
      `\cortx-cortx-management-portal\web - npm run dev`
  
   4. Open the browser and run [http://localhost:8080/](http://localhost:8080/).

</p>
</details>

## 1.3 Run Unit Test - new process

You can run a Unit Test using build RPMs: 

  <details>
   <summary>Click to expand!</summary>
   <p>
      
- RPMs are generated for each pull request, please find RPMS's on below location for the cortx-management-portal:
   
   [http://cortx-storage.colo.seagate.com/releases/cortx/components/dev/multibranch/cortx-management-portal/](http://cortx-storage.colo.seagate.com/releases/cortx/components/dev/multibranch/cortx-management-portal/)
   
- You'll need to install the RPM on your VM.

</p>
</details>

## 1.4 Deploy the CORTX-Management-Portal on your VM

**Before you begin:** Ensure you install all dependencies and meet prerequisites.

<details>
   <summary>Deploy CORTX-Management-Portal on VM</summary>
   <p>

1. Login to your VM using SSH your GitHub ID and Password.
2. Remove previously installed cortx-management-portal RPMs (if any):

   for pkg in `$ rpm -qa | grep -E "cortx|salt"`; 
   
   Run `$ yum remove -y $pkg` 

3. Install cortx-management-portal RPM: 

    `$ yum install -i ./dist/rpmbuild/RPMS/x86_64/cortx-csm_agent-web.rpm`
    
    `$ yum install -i ./dist/rpmbuild/RPMS/x86_64/cortx-csm_agent-gui.rpm`

4. Executing cortx-management-portal-setup commands should pass: 

   `$ cortx_management_portal_setup post_install`

   `$ cortx_management_portal config`

   `$ cortx_management_portal_setup init`

5. Enable and Restart the Cortx-Management-Portal service: 

   `$ systemctl restart cortx_management_portal`
   `$ systemctl enable cortx_management_portal`
   
   </p>
   </details>
   
## 1.5 Run CORTX-Management-Portal 

To run the cortx-management-portal node application:

<details>
   <summary>Open a duplicate tab and follow these steps:</summary>
   <p>

1. Login as super user.
2. Change the `.env` file in web for server_protocol from `https` to `http` 
3. Install node modules.
4. Run cortx-management-portal node application 
   
   ```shell
   
   $ sudo su 
   $ vim /opt/seagate/cortx/cortx-management-portal/.env 
   $ cd /opt/seagate/cortx/cortx-management-portal 
   $ npm install 
   $ npm run dev 
   ```
 
5. Once the cortx-management-portal starts successfully, it will return the URL to point to with the port. 

</p>
</details>

### Run CORTX-Management-Portal UI: 

<details>
   <sumamry>Run CORTX-Management-Portal UI</summary>
   <p>
   
   1. To run cortx-management-portal UI, open a duplicate tab.
   2. Login as a super user.
   3. Go to the gui directory.
   4. Install node modules.
   5. Run gui application:
   
      ```shell
   
      $ sudo su 
      $ cd /opt/seagate/cortx/cortx-management-portal/cortx/gui/ 
      $ npm install 
      $ npm run serve 
      ```
   
   6. Once the cortx-management-portal UI, runs successfully, it retuns the URL to the UI. 
   7. Copy this link and open the UI in the browser. 
   8. You'll be redirected to the login page. 
   
   </p>
   </details>
   
   You'll need to complete the [Preboarding](#Preboarding) and [Onboarding](#Onboarding) steps to start using the CORTX-Management-Portal UI.
   
   ### Preboarding
   
   **Before you begin:** 
   
   To proceed with login and create your administrator account, navigate to http://<hostname>:<port>/#/preboarding/welcome. 
  
   ![](/images/WelcomeScreen.png)
   
   :page_with_curl: **Note:** You can create the admin user only once during setting up the system. The admin user has all the permissions in the system. 
   
   <details>
   <summary>You must log in with the admin user and password to continue onboarding configuration.</summary>
   <p>
   
   1. Click *start* and select *Next*.
   2. Click *Get started* and accept the Terms & Conditions.
      
      ![](/images/Terms&Conditions.png)
   3. Create your admininistrator account. 
      
      ![](/images/UsernamePwd.png)
   4. Return to the cortx-management-portal login page using the link http://<hostname>:<port>/.
      
      ![](/images/Login.png)
   
   </p>
   </details>
   
   ### Onboarding
   
   To start using the CORTX-Management-Portal, you'll need to complete the onboarding process. 
   
   Enter the system name and follow the steps below. 
   
   ![](/images/SystemName.png)
   
   <details>
   <summary>Click to expand!</summary>
   <p>
      
   The onboarding process lets you set up the system and configure the following.
   
   1. [Upload SSL certificate](#1-Upload-SSL-certificate)
   
   2. [Configure DNS resolver settings](#2-Configure-DNS-resolver-settings)
   
   3. [Configure network time protocol settings](#3-Configure-network-time-protocol-settings)
   
   4. [Configure notifications](#4-Configure-notifications)
   
   5. [Verify onboarding configurations](#5-Verify-onboarding-configurations)
   
   #### 1. Upload SSL certificate
   
   A SSL certificate is used on a https connection to encrypt the communication from a S3 Client or your web browser to CORTX Manager. By default, the CORTX Manager uses a CORTX    Manager provided self-signed certificate. Alternatively, you can upload a user-provided self-signed certificate or a user provided certificate authority (CA) signed  certificate. This step can be done during onboarding or afterwards.
   
   ![](/images/SSL%20Upload.png)
  
   To upload SSL certificate:
   
   1. Click Choose File to browse and select the appropriate SSL certificate, and then click Upload certificate. 
   2. Click Continue to open the Management network settings page. 

   #### 2. Configure DNS resolver settings
   
   ![](/images/DNS.png)
   
   To configure DNS resolver settings:
   
   1. On the DNS resolver settings page, enter values for DNS Server and Search Domain.
   2. Click Apply and Continue to open the Network time protocol (NTP) page.
   
   #### 3. Configure network time protocol
   
   CORTX and any S3 Clients must be time synchronized via a NTP server. CORTX Manager allows the setting of the NTP server address and a time zone. The time zone on CORTX Manager does not have to match the S3 Client(s). Once the CORTX Manager setting is applied, the setting is then configured on both servers in CORTX. 
   
   ![](/images/NTP.png)
   
   To configure network time protocol:
   
   1. On the Network time protocol (NTP) page, enter NTP server address and select the time zone. 
   2. The selected time zone is used by the system.
      - Click Apply and Continue to open the Notifications settings tab.

   #### 4. Configure notifications
   
   The system offers you to configure notifications. You can configure the system to receive notification via email using the Simple Network Management Protocol (SNMP). Once configured, you can receive notifications about any system updates or alerts. You have an option to skip configuring the notifications but it is not recommended. It is recommended to configure at least one email to receive system notification. 
   
   **Table 4:** Supported and unsupported email configurations lists the supported and unsupported email configurations.
   
   | **Type** | **Supported/Unsupported** |
   |-	|-	|
   | By encryption: | |
   | No encryption | Supported |
   | SSL/TLS | Supported |
   | STARTTLS | Supported | 
   | By authentication: | |
   | SMTP servers which support/require authentication | Supported |
   | SMTP servers which do not support authentication | Not supported |
   
   ![](/images/Notification.png)
   
   To configure notifications:
   
   1. From the Notifications page, select the Email check box, and then click Continue.
   2. Enter values for SMTP server, Sender email, Protocol, SMTP port, Sender password, and Confirm password.
   3. In the Receiver email addresses, you can enter multiple email addresses separated by comma (,).
   4. Click Send test email to verify the email configuration. If you do not receive test email on the configured email addresses then check the email configuration.
   5. Click Apply and Continue to open the Summary page.

   #### Verify onboarding configuration
   
   The Summary page displays all the onboarding configurations. You can verify the configurations and if required, go back to a page to change the configurations. After
   verifying the configurations, the system moves to the new IP address added during the configuration. You must use the new IP address to access the system.
   
   ![](/images/Summary.png)
   
   To verify the configurations:
   
   - Review the configurations, and then click Continue.
   
   The Confirmation pop-up displays the new IP address of the system. You must use the new IP address to access the system.
   
   ![](/images/Dashboard.png)
   
   </p>
   </details>

## 1.6 REST API document

CORTX Management Swagger is available [here](https://<management_IP>:28100/api-docs).

The Curl command for getting the URL is:

`curl -X GET "https://:28100/api/v1/stats?metric=throughput.read.mb&from=1607481696&to=1607481711&total_sample=1" -H "accept: application/json" -H "authorization: Bearer [AUTH]"`

**Sample URL:**

`https://<mgmt_ip>:28100/api/v1/stats?metric=throughput.read.mb&from=1607481696&to=1607481711&total_sample=1`

**Sample Output:** 

![](/images/SwaggerForCORTX.png)

`curl -X GET "https://10.230.255.16:28100/api/v1/auditlogs/show/s3?start_date=1607500000&end_date=1607549999" -H "accept: application/json" -H "authorization: Bearer [AUTH]"`
 
 Don't forget to run the command: `curl -X POST "https://10.230.255.16:28100/api/v1/login" -H "accept: application/json" -H "Content-Type: application/json" -d "{ "username": "Administrator", "password": "Seagate@1"}"`

`[
"a9202d6a64d94fa1ac6b6d09a902ae2b84390e4557004d19b4a471cd2525f429 gtbucket1 [10/Dec/2020:00:07:53 +0530]172.16.1.78 847912992506 47b522c3-0bfe-4214-bb58-0bc843235daf REST.GET.BUCKETLOCATION gtbucket1/ GET /gtbucket1?location HTTP/1.1200 - 136 0 6666 - aws-cli/2.1.7 Python/3.7.3 Linux/3.10.0-1127.el7.x86_64 exe/x86_64.centos.7 prompt/off command/s3api.get-bucket-location -SigV4 - AuthHeader 172.16.8.16",
"f191c3c1fe654072abfbf1bcba0a0ae626d5fb429ef44574a12882c906814f39 gtbucket [10/Dec/2020:00:07:41 +0530]172.16.1.78 847912992506 85e639c7-40ca-4897-a9a9-c1cb83781a8b REST.GET.BUCKETLOCATION gtbucket/ GET /gtbucket?location HTTP/1.1403 AccessDenied 0 0 6969 - aws-cli/2.1.7 Python/3.7.3 Linux/3.10.0-1127.el7.x86_64 exe/x86_64.centos.7 prompt/off command/s3api.get-bucket-location -SigV4 - AuthHeader 172.16.8.16"
]
`

## You're All Set & You're Awesome!

We thank you for stopping by to check out the CORTX Community. We are fully dedicated to our mission to build open source technologies that help the world save unlimited data and solve challenging data problems. Join our mission to help reinvent a data-driven world. 

### Contribute to CORTX Management Portal

Please contribute to the [CORTX Open Source project](CONTRIBUTING.md) and join our movement to make data storage better, efficient, and more accessible.

### Reach Out to Us

You can reach out to us with your questions, feedback, and comments through our [CORTX Communication Channels](https://github.com/Seagate/cortx/blob/main/SUPPORT.md)
