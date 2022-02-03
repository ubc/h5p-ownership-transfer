<?php
/**
 * UBC H5P Addon - Content Author Transfer
 *
 * @package     UBC H5P
 * @author      Kelvin Xu
 * @copyright   2021 University of British Columbia
 * @license     GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: UBC H5P Addon - Content Ownership Transfer
 * Plugin URI:  https://ubc.ca/
 * Description: Allowed users with certain capability to transfer the ownership of h5p content to another user.
 * Version:     1.0.5
 * Author:      Kelvin Xu
 * Text Domain: ubc-h5p-addon-content-ownership-transfer
 * License:     GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 */

namespace UBC\H5P\OwnershipTransfer;

define( 'H5P_OWNERSHIP_TRANSFER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'H5P_OWNERSHIP_TRANSFER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin initialization
 *
 * @return void
 */
function init() {
	if ( ! current_user_can( apply_filters( 'h5p_ownership_transfer_required_capability', 'edit_others_h5p_contents' ) ) ) {
		return;
	}

	require_once 'includes/class-contentownershiptransferdb.php';
	require_once 'includes/class-contentownershiptransfer.php';
}

add_action( 'admin_init', __NAMESPACE__ . '\\init' );
