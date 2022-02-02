# H5P Addon - Ownership Transfer

## Description
**this add-on adds extra functionality on top of H5P WordPress plugin. Please make sure the H5P plugin is installed and activated.*

The plugin allows users with certain capabilities to transfer the ownership of a h5p content to another user. 
## User Capability
Only users with the correct capability will be able to use the ownership transfer feature.
The current capability is set to be **edit_others_h5p_contents** by default.

However, developers can use **h5p_ownership_transfer_required_capability** filter to alter the capability that is required for user to use the ownership transfer functionality.

## Local Environment
Install node packages
`npm install`

Start building JS and CSS for development
`npm start`

Build JS and CSS for production
`npm build`

Install phpcs with WordPress coding standard
`composer install`