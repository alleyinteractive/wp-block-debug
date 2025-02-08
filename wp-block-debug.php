<?php
/**
 * Plugin Name: Alley Block Debug
 * Plugin URI: https://github.com/alleyinteractive/wp-block-debug
 * Description: Block debug panel.
 * Version: 0.2.0
 * Author: Alley
 * Author URI: https://github.com/alleyinteractive/wp-block-debug
 * Requires at least: 6.7
 * Tested up to: 6.7
 *
 * Text Domain: wp-block-debug
 * Domain Path: /languages/
 *
 * @package wp-block-debug
 */

namespace Alley\WP\Block_Debug;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Root directory to this plugin.
 */
define( 'WP_BLOCK_DEBUG_DIR', __DIR__ );

// Check if Composer is installed (remove if Composer is not required for your plugin).
if ( ! file_exists( __DIR__ . '/vendor/wordpress-autoload.php' ) ) {
	// Will also check for the presence of an already loaded Composer autoloader
	// to see if the Composer dependencies have been installed in a parent
	// folder. This is useful for when the plugin is loaded as a Composer
	// dependency in a larger project.
	if ( ! class_exists( \Composer\InstalledVersions::class ) ) {
		\add_action(
			'admin_notices',
			function () {
				?>
				<div class="notice notice-error">
					<p><?php esc_html_e( 'Composer is not installed and wp-block-debug cannot load. Try using a `*-built` branch if the plugin is being loaded as a submodule.', 'wp-block-debug' ); ?></p>
				</div>
				<?php
			}
		);

		return;
	}
} else {
	// Load Composer dependencies.
	require_once __DIR__ . '/vendor/wordpress-autoload.php';
}

// Load the plugin's main files.
require_once __DIR__ . '/src/assets.php';
require_once __DIR__ . '/src/main.php';

load_scripts();
main();
