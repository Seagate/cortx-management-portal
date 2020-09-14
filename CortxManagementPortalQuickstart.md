# CORTX-Management-Portal Quickstart Guide

This guide provides a step-by-step walkthrough for getting you CORTX-Management-Portal ready.

- [1.0 Prerequisites](##10-Prerequisites)
- [1.2 1.2 Setup the Development Environment locally](#12-Setup-the-Development-Environment-locally)
- [1.3 Run Unit Test](#13-Run-Unit-Test)
- [1.4 Deploy the CORTX-Management-Portal on your VM](#14-Deploy-the-CORTX-Management-Portal-on-your-VM)

## 1.0 Prerequisites

<details>
<summary>Before you begin</summary>
<p>

1. Login with super user:
   
   `$ sudo su`

    Or 
    
    `$ sudo -s`

2. Install Node.js

   ```shell

   $ wget  https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz
   $ tar -xvf node-v12.13.0-linux-x64.tar.xz
   $ mkdir /opt/nodejs
   $ cp -r node-v12.13.0-linux-x64 /opt/nodejs/
   $ ln -s /opt/nodejs/node-v12.13.0-linux-x64/bin/node /usr/bin node
   $ ln -s /opt/nodejs/node-v12.13.0-linux-x64/bin/npm /usr/bin
   npm
   ``` 
3. Install GitHub
     
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

4. Run `npm install` or `npm i`.

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
   
   You'll need to install the RPM on your VM.

## 1.4 Deploy the CORTX-Management-Portal on your VM

**Before you begin:** 

Ensure you install all dependencies and meet prerequisites.

1. Login to your VM using SSH your GitHub ID and Password.
2. Remove previously installed cortx-management-portal RPMs (if any):

   for pkg in `rpm -qa | grep -E "eos|salt"`; 
   
   Run `yum remove -y $pkg` 

3. Install cortx-management-portal RPM:

    `yum install -i <csm-web-rpm-link>`

4. Executing cortx-management-portal-setup commands should pass: 

   `cortx_management_portal_setup post_install`

   `cortx_management_portal config`

   `cortx_management_portal_setup init`

5. Enable and Restart the Cortx-Management-Portal service: 

   `systemctl restart cortx_management_portal`
   `systemctl enable cortx_management_portal`

## You're All Set & You're Awesome!

We thank you for stopping by to check out the CORTX Community. We are fully dedicated to our mission to build open source technologies that help the world save unlimited data and solve challenging data problems. Join our mission to help reinvent a data-driven world. 

### Contribute to CORTX Management Portal

Please contribute to the [CORTX Open Source project](https://github.com/Seagate/cortx/blob/main/doc/SuggestedContributions.md) and join our movement to make data storage better, efficient, and more accessible.

Refer to our [CORTX Community Guide](https://github.com/Seagate/cortx/blob/main/doc/CORTXContributionGuide.md) to get started with your first contribution.

### Reach Out to Us

You can reach out to us with your questions, feedback, and comments through our CORTX Communication Channels:

- Join our CORTX-Open Source Slack Channel to interact with your fellow community members and gets your questions answered. [![Slack Channel](https://img.shields.io/badge/chat-on%20Slack-blue)](https://join.slack.com/t/cortxcommunity/shared_invite/zt-femhm3zm-yiCs5V9NBxh89a_709FFXQ?)
- If you'd like to contact us directly, drop us a mail at cortx-questions@seagate.com.



