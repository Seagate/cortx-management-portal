# CORTX-Management-Portal Quickstart Guide

This guide provides a step-by-step walkthrough for getting you CORTX-Management-Portal ready.

- [1.0 Prerequisites](##10-Prerequisites)
- [1.2 1.2 Setup the Development Environment locally](#12-Setup-the-Development-Environment-locally)
- [1.3 Run Unit Test](#13-Run-Unit-Test)
- [1.4 Deploy the CORTX-Management-Portal on your VM](#14-Deploy-the-CORTX-Management-Portal-on-your-VM)
- [1.5 Run Cortx-Management-Portal UI](#15-Run-Cortx-Management-Portal)

## 1.0 Prerequisites

<details>
<summary>Before you begin</summary>
<p>
   
1. You'll need to install [CORTX-Manager](https://github.com/Seagate/blob/cortx-manager)  

2. Login with super user:
   
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
     
     Refer to the [Contributing to CORTX Management Portal](Contribution.md) document to install GitHub and clone cortx-manager and its dependent repos.
 
</p>
</details>

## 1.2 Setup the Development Environment locally

**Before you begin:** Ensure that you've installed Vue.js on the local system.

<details>
<summary>Click to expand!</summary>
<p>

1. Click open the UI repository link [here](https://github.com/Seagate/cortx-management-portal).
2. Clone the UI repository using this [URL](https://github.com/Seagate/cortx-management-portal.git) in new folder and run:

  ```shell

  $ git clone  https://github.com/Seagate/cortx-cortx-management-portal.git
  ```
3. Run the following command in both:

   `\cortx-management-portal\gui` and,

   ` \cortx-management-portal\web` to install dependent packages

4. Run `$ npm install` or `npm i`.

5. Change the proxy in the `vue.config.js` file from the GUI folder to point or access the backend REST API
 proxy:
 
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

## 1.3 Run Unit Test

You can perform unit tests in two ways:

1. Manual Unit Testing

2. Test using build RPMs

   - RPMs are generated for each pull request, please find RPMS's on below location for the cortx-management-portal.

     [http://cortx-storage.colo.seagate.com/releases/cortx/components/dev/multibranch/cortx-management-portal/]
   
   - You'll need to install the RPM on your VM.

## 1.4 Deploy the CORTX-Management-Portal on your VM

**Before you begin:** 

Ensure you install all dependencies and meet prerequisites.

1. Login to your VM using SSH your GitHub ID and Password.
2. Remove previously installed cortx-management-portal RPMs (if any):

   for pkg in `$ rpm -qa | grep -E "eos|salt"`; 
   
   Run `$ yum remove -y $pkg` 

3. Install cortx-management-portal RPM:

    `$ yum install -i <cortx-management-portal-rpm-link>`

4. Executing cortx-management-portal-setup commands should pass: 

   `$ cortx_management_portal_setup post_install`

   `$ cortx_management_portal config`

   `$ cortx_management_portal_setup init`

5. Enable and Restart the Cortx-Management-Portal service: 

   `$ systemctl restart cortx_management_portal`
   `$ systemctl enable cortx_management_portal`
   
## 1.5 Run CORTX-Management-Portal 

To run the cortx-management-portal node application, open a duplicate tab and follow these steps:

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

   ### Run CORTX-Management-Portal UI: 
   
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
   
   ### Preboarding
   
   **Before you begin:** To proceed with login and create your administrator account, navigate to http://<hostname>:<port>/#/preboarding/welcome.
   
   :page_with_curl: **Note:** You can create the admin user only once during setting up the system. The admin user has all the permissions in the system. 
   
   You must log in with the admin user and password to continue onboarding configuration.
   
   1. Click *start* and select *Next*.
   2. Click *Get started* and accept the EULA.
   3. Create your admininistrator account. 
   4. Return to the cortx-management-portal login page using the link http://<hostname>:<port>/.
   
   ### Onboarding
   
   To start using the CORTX-Management-Portal, you'll need to complete the onboarding process. The onboarding process lets you set up the system and configure the following:
   
   [1	Upload SSL certificate](#1-Upload-SSL-certificate)
   [2	Configure DNS resolver settings](#2-Configure-DNS-resolver-settings)
   [3	Configure network time protocol settings](#3-Configure-network-time-protocol-settings)
   [4	Configure notifications](#4-Configure-notifications)
   [5	Verify  onboarding  configurations](#5-Verify- onboarding-configurations)
   
   #### 1. Upload SSL certificate
   
   A SSL certificate is used on a https connection to encrypt the communication from a S3 Client or your web browser to CORTX Manager. By default, the CORTX Manager uses a CORTX    Manager provided self-signed certificate. Alternatively, you can upload a user-provided self-signed certificate or a user provided certificate authority (CA) signed  certificate. This step can be done during onboarding or afterwards.
  
   To upload SSL certificate:
   
   1. Click Choose File to browse and select the appropriate SSL certificate, and then click Upload certificate. 
   2. Click Continue to open the Management network settings page. 

   #### 2. Configure DNS resolver settings
   
   To configure DNS resolver settings:
   
   1. On the DNS resolver settings page, enter values for DNS Server and Search Domain.
   2. Click Apply and Continue to open the Network time protocol (NTP) page.
   
   #### 3. Configure network time protocol
   
   CORTX and any S3 Clients must be time synchronized via a NTP server. CORTX Manager allows the setting of the NTP server address and a time zone. The time zone on CORTX Manager does not have to match the S3 Client(s). Once the CORTX Manager setting is applied, the setting is then configured on both servers in CORTX. 
   
   To configure network time protocol:
   
   1. On the Network time protocol (NTP) page, enter NTP server address and select the time zone. 
   2. The selected time zone is used by the system.
      - Click Apply and Continue to open the Notifications settings tab.

   #### 4. Configure notifications
   
   The system offers you to configure notifications. You can configure the system to receive notification via email using the Simple Network Management Protocol (SNMP). Once configured, you can receive notifications about any system updates or alerts. You have an option to skip configuring the notifications but it is not recommended. It is recommended to configure at least one email to receive system notification. 
   
   Table 4: Supported and unsupported email configurations lists the supported and unsupported email configurations.
   
   | **Type** | **Supported/Unsupported** |
   |-	|-	|
   | By encryption: | |
   | No encryption | Supported |
   | SSL/TLS | Supported |
   | STARTTLS | Supported | 
   | By authentication: | |
   | SMTP servers which support/require authentication | Supported |
   | SMTP servers which do not support authentication | Not supported |
   
   To configure notifications:
   
   From the Notifications page, select the Email check box, and then click Continue.
   
      1. Enter values for SMTP server, Sender email, Protocol, SMTP port, Sender password, and Confirm password.
      2. In the Receiver email addresses, you can enter multiple email addresses separated by comma (,).
      3. Click Send test email to verify the email configuration. If you do not receive test email on the configured email addresses then check the email configuration.
      4. Click Apply and Continue to open the Summary page.

   #### Verify onboarding configuration
   
   The Summary page displays all the onboarding configurations. You can verify the configurations and if required, go back to a page to change the configurations. After
   verifying the configurations, the system moves to the new IP address added during the configuration. You must use the new IP address to access the system.
   
   To verify the configurations:
   
   - Review the configurations, and then click Continue.
   
   The Confirmation pop-up displays the new IP address of the system. You must use the new IP address to access the system.

## You're All Set & You're Awesome!

We thank you for stopping by to check out the CORTX Community. We are fully dedicated to our mission to build open source technologies that help the world save unlimited data and solve challenging data problems. Join our mission to help reinvent a data-driven world. 

### Contribute to CORTX Management Portal

Please contribute to the [CORTX Open Source project](https://github.com/Seagate/cortx/blob/main/doc/SuggestedContributions.md) and join our movement to make data storage better, efficient, and more accessible.

Refer to our [CORTX Contribution Guide](https://github.com/Seagate/cortx/blob/main/doc/CORTXContributionGuide.md) to get started with your first contribution.

### Reach Out to Us

You can reach out to us with your questions, feedback, and comments through our CORTX Communication Channels:

- Join our CORTX-Open Source Slack Channel to interact with your fellow community members and gets your questions answered. [![Slack Channel](https://img.shields.io/badge/chat-on%20Slack-blue)](https://join.slack.com/t/cortxcommunity/shared_invite/zt-femhm3zm-yiCs5V9NBxh89a_709FFXQ?)
- If you'd like to contact us directly, drop us a mail at cortx-questions@seagate.com.
