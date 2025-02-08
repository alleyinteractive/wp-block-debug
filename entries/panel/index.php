<?php
/**
 * Entry point "panel" script registration and enqueue.
 *
 * This file will be copied to the assets output directory
 * with Webpack using wp-scripts build. The build command must
 * be run before this file will be available.
 *
 * This file must be included from the build output directory in a project.
 * and will be loaded from there.
 *
 * @package wp-block-debug
 */

/**
 * Register the panel entry point assets so that they can be enqueued.
 */
function wp_block_debug_register_panel_scripts(): void {
	// Automatically load dependencies and version.
	$asset_file = include __DIR__ . '/index.asset.php';

	if (
		! is_array( $asset_file )
		|| ! isset( $asset_file['dependencies'], $asset_file['version'] )
		|| ! is_array( $asset_file['dependencies'] )
		|| ! is_string( $asset_file['version'] )
	) {
		return;
	}

	// Register the panel script.
	wp_register_script(
		'wp-block-debug-panel-js',
		plugins_url( 'index.js', __FILE__ ),
		array_filter( $asset_file['dependencies'], 'is_string' ),
		$asset_file['version'],
		true
	);
	wp_set_script_translations( 'wp-block-debug-panel-js', 'wp-block-debug' );

	// Register the panel style.
	wp_register_style(
		'wp-block-debug-panel-css',
		plugins_url( 'index.css', __FILE__ ),
		[],
		$asset_file['version'],
	);
}
add_action( 'init', 'wp_block_debug_register_panel_scripts' );

/**
 * Enqueue assets for the panel entry point.
 */
function wp_block_debug_enqueue_panel_assets(): void {
	if ( current_user_can( 'view_block_debug' ) ) {
		wp_enqueue_script( 'wp-block-debug-panel-js' );
		wp_enqueue_style( 'wp-block-debug-panel-css' );
	}
}
add_action( 'enqueue_block_editor_assets', 'wp_block_debug_enqueue_panel_assets' );
