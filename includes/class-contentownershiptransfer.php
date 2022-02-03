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
		add_action( 'wp_ajax_ubc_h5p_ownership_transfer', array( $this, 'verify_new_owner' ) );
		add_action( 'wp_ajax_ubc_h5p_get_content_author_email', array( $this, 'get_content_author_email' ) );
	}

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
	 * Get the author email of h5p content based on content ID.
	 *
	 * @return void
	 */
	public function get_content_author_email() {
		check_ajax_referer( 'security', 'nonce' );

		$content_id = isset( $_POST['content_id'] ) ? intval( $_POST['content_id'] ) : null;

		$content_author_email = ContentOwnershipTransferDB::get_content_author_email( $content_id );

		if ( false === $content_author_email ) {
			wp_send_json_error();
		} else {
			wp_send_json_success( $content_author_email );
		}
	}

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
					'valid'   => false,
					'message' => 'System error, please contact platform administrator.',
				)
			);
		}

		if ( empty( $email ) ) {
			wp_send_json(
				array(
					'valid'   => false,
					'message' => 'The email address you have provided is empty. Please enter a valid email address to continue.',
				)
			);
		}

		if ( false === get_user_by( 'email', $email ) ) {
			wp_send_json(
				array(
					'valid'   => false,
					'message' => $email . 'is not attached to a user on this platform. No changes made.',
				)
			);
		}

		$content_author_email = ContentOwnershipTransferDB::get_content_author_email( $content_id );

		if ( $email === $content_author_email ) {
			wp_send_json(
				array(
					'valid'   => false,
					'message' => $email . ' is already the author of this H5P content. No changes made.',
				)
			);
		}

		ContentOwnershipTransferDB::update_content_author( $content_id, $email );

		wp_send_json(
			array(
				'valid'   => true,
				'message' => $email . ' is now the author of this H5P content.',
			)
		);
	}//end verify_new_owner()
}

new ContentOwnershipTransfer();
