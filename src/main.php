<?php
/**
 * The main plugin function
 *
 * @package create-wordpress-plugin
 */

namespace Alley\WP\Block_Debug;

use Alley\WP\Features\Group;
use Alley\WP\Features\Quick_Feature;

/**
 * Instantiate the plugin.
 */
function main(): void {
	$plugin = new Group(
		new Quick_Feature(
			fn () => add_filter(
				'map_meta_cap',
				function ( $caps, $cap ) {
					if ( 'view_block_debug' === $cap ) {
						$caps = [ 'edit_posts' ];
					}

					return $caps;
				},
				0,
				2,
			),
		),
	);

	$plugin->boot();
}
