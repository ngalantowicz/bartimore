<?php

function get_baltimore_boundary_data() {

    global $wpdb;
    $result = $wpdb->get_results( "SELECT * FROM wp_baltimore_boundaries");
    return json_encode($result);
}

function get_bar_data() {

    $posts = get_posts(array(
        'post_type' => 'bar',
        'status' => 'publish',
        'numberposts' => -1
    ));
    $arr = array();
    foreach ($posts as $pst) {
        $data = get_post_meta( $pst->ID );
        $name = $pst->post_name;
        $result['bar_slug'] = $name;
        $result['bar_name'] = $data['bar_id'][0];
        $result['bar_coords'] = $data['bar_coordinates'][0];
        $result['bar_summary'] = $data['summary'][0];
        $arr[] = $result;
    }
    return json_encode($arr);
}

// Register the script
wp_register_script( 'baltimore_map', get_stylesheet_directory_uri().'/js/map.js' );

// Localize the script with new data
$translation_array = get_baltimore_boundary_data();
$bar_array = get_bar_data();

wp_localize_script( 'baltimore_map', 'baltimoreBoundaries', $translation_array );
wp_localize_script( 'baltimore_map', 'baltimoreBars', $bar_array );

// Enqueued script with localized data.
wp_enqueue_script( 'openLayers', get_stylesheet_directory_uri() .'/js/ol.js');
wp_enqueue_script( 'baltimore_map');

//Add openLayers Styles
wp_enqueue_style( 'bartimore', get_stylesheet_directory_uri().'/css/ol.css' );
