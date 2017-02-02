<?php
/**
 * Plugin Name: Bar Locations
 * Plugin URI: http://www.google.com
 * Description: Allows for us to know what bar associates with post
 * Author: Nicky G
 * Version: 1.0
 */

//Exit if accessed directly
if ( ! defined( 'ABSPATH') ) {
    exit;
}

require_once (plugin_dir_path(__FILE__) . 'wp-bar-geo-cpt.php');
require_once (plugin_dir_path(__FILE__) . 'wp-bar-geo-fields.php');

function dwwp_admin_enqueue_scripts() {
    global $pagenow, $typenow;

    if ( ($pagenow == 'post.php' || $pagenow == 'post-new.php') && $typenow == 'bar') {
        wp_enqueue_style( 'dwwp-admin-css', plugins_url( 'css/admin-bar-geo.css', __FILE__ ) );
        wp_enqueue_script( 'dwwp-admin-js', plugins_url( 'js/admin-bar-geo.js', __FILE__ ), array( 'jquery', 'jquery-ui-datepicker' ), '20170131', true );
    }
}
add_action( 'admin_enqueue_scripts', 'dwwp_admin_enqueue_scripts' );
