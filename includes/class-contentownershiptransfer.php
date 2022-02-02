<?php
/**
 * Content ownership transfer class.
 *
 * @since 1.0.0
 * @package ubc-h5p-ownership-transfer
 */

namespace UBC\H5P\OwnershipTransfer;

/**
 * Class to initiate Content OwnershipTransfer functionalities
 */
class ContentOwnershipTransfer {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		add_action( 'load-h5p-content_page_h5p_new', array( $this, 'enqueue_add_new_content_script' ), 10 );
		add_filter( 'wp_redirect', array( $this, 'h5p_content_ownership_transfer_actions' ) );
		add_action( 'wp_ajax_ubc_h5p_verify_new_owner', array( $this, 'verify_new_owner' ) );
	}

	/**
	 * Callback to save taxonomy information after H5P content is created. Delete taxonomy rows when content is deleted.
	 * Not ideal to use wp_redirect filter since WordPress filter is suppose to change stuff not add stuff.
	 * However, due to cusotmization limitation from H5P plugin, this is currently the only way to make it work.
	 *
	 * @param string $location the URL to redirect user to.
	 * @return string the URL to redirect user to.
	 */
	public function h5p_content_ownership_transfer_actions( $location ) {
		$url_components = wp_parse_url( $location );
		parse_str( $url_components['query'], $params );

		// Save taxonomies when creating new h5p content.
		if ( isset( $_GET['page'] ) && 'h5p_new' === $_GET['page'] && isset( $params['id'] ) && isset( $_REQUEST['h5p-content-new-author-email'] ) ) {
			// phpcs:ignore
			ContentOwnershipTransferDB::update_content_author( intval( $params['id'] ), $_REQUEST['h5p-content-new-author-email'] );
		}

		return $location;
	}//end h5p_content_ownership_transfer_actions()

	/**
	 * Load assets for h5p new content page.
	 *
	 * @return void
	 */
	public function enqueue_add_new_content_script() {
		if ( ! ( isset( $_GET['page'] ) && 'h5p_new' === $_GET['page'] && isset( $_GET['id'] ) ) ) {
			return;
		}

		wp_enqueue_script(
			'ubc-h5p-ownership-transer-js',
			H5P_OWNERSHIP_TRANSFER_PLUGIN_URL . 'assets/dist/js/h5p-new.js',
			array(),
			filemtime( H5P_OWNERSHIP_TRANSFER_PLUGIN_DIR . 'assets/dist/js/h5p-new.js' ),
			true
		);

		wp_localize_script(
			'ubc-h5p-ownership-transer-js',
			'ubc_h5p_ownership_transfer_admin',
			array(
				'security_nonce' => wp_create_nonce( 'security' ),
			)
		);

		wp_register_style(
			'ubc-h5p-ownership-transfer-css',
			H5P_OWNERSHIP_TRANSFER_PLUGIN_URL . '/assets/dist/css/h5p-new.css',
			array(),
			filemtime( H5P_OWNERSHIP_TRANSFER_PLUGIN_DIR . 'assets/dist/css/h5p-new.css' )
		);
		wp_enqueue_style( 'ubc-h5p-ownership-transfer-css' );
	}//end enqueue_add_new_content_script()

	/**
	 * Ajax handler to verify if the email address of the new owner is valid.
	 *
	 * @return void
	 */
	public function verify_new_owner() {
		check_ajax_referer( 'security', 'nonce' );

		$email      = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : null;
		$content_id = isset( $_POST['content_id'] ) ? intval( $_POST['content_id'] ) : null;

		if ( empty( $content_id ) ) {
			wp_send_json(
				array(
					'valid'         => false,
					'error_message' => 'System error, please contact platform administrator.',
				)
			);
		}

		if ( empty( $email ) ) {
			wp_send_json(
				array(
					'valid'         => false,
					'error_message' => 'Email address is empty.',
				)
			);
		}

		if ( false === get_user_by( 'email', $email ) ) {
			wp_send_json(
				array(
					'valid'         => false,
					'error_message' => 'User email does not exist.',
				)
			);
		}

		$content_author_email = ContentOwnershipTransferDB::get_content_author_email( $content_id );

		if ( $email === $content_author_email ) {
			wp_send_json(
				array(
					'valid'         => false,
					'error_message' => 'The author of the current h5p content is the same as the target user.',
				)
			);
		}

		wp_send_json(
			array(
				'valid' => true,
			)
		);
	}//end verify_new_owner()
}

new ContentOwnershipTransfer();
