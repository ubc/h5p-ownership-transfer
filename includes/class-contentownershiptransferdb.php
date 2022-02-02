<?php
/**
 * ContentOwnershipTransferDB connects to H5P database.
 *
 * @since 1.0.0
 * @package ubc-h5p-ownership-transfer
 */

namespace UBC\H5P\OwnershipTransfer;

/**
 * Helper utility class.
 */
class ContentOwnershipTransferDB {
	/**
	 * Get h5p content author email by ID.
	 *
	 * @param int $content_id ID of the h5p content.
	 * @return string author email of target h5p content.
	 */
	public static function get_content_author_email( $content_id ) {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$results = $wpdb->get_results( $wpdb->prepare( "SELECT `user_id` FROM {$wpdb->prefix}h5p_contents WHERE id = %d", $content_id ) );

		if ( count( $results ) === 0 ) {
			return false;
		}

		if ( ! isset( $results[0]->user_id ) || is_int( $results[0]->user_id ) ) {
			return false;
		}

		$user = get_user_by( 'id', $results[0]->user_id );

		return false !== $user ? $user->data->user_email : false;
	}

	/**
	 * Assign a new author to a h5p content.
	 *
	 * @param int    $content_id ID of the h5p content.
	 * @param string $new_author_email the email address of the new author.
	 */
	public static function update_content_author( $content_id, $new_author_email ) {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		if ( empty( $content_id ) || empty( $new_author_email ) ) {
			return;
		}

		$new_user = get_user_by( 'email', $new_author_email );
		if ( false === $new_user ) {
			return;
		}

		$original_author_email = self::get_content_author_email( $content_id );
		if ( $original_author_email === $new_author_email ) {
			return;
		}

		$results = $wpdb->update(
			$wpdb->prefix . 'h5p_contents',
			array( 'user_id' => $new_user->ID ),
			array( 'id' => $content_id ),
		);
	}
}
