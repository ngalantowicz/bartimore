<?php
function dwwp_bar_location_list( $atts, $content = null ) {

    $atts = shortcode_atts(
        array(
            'title' => 'Current Bars in...',
        ), $atts );

    $locations = get_terms( 'location' );

    $displaylist = '<div id="bar-location-list">';

        foreach ($locations as $location) {
            $displaylist .= '<h4 class="bar-location">'. $location->name . '</h4>';

            $args = array(
                'post_type'         => 'bar',
                'post_status'       => 'publish',
                'tax_query'         => array(
                    array(
                        'taxonomy'  => 'location',
                        'field'     => 'slug',
                        'terms'     => $location->name
                    ),
                )
            );

            $bars_by_location = new WP_Query ( $args );
            $bars = $bars_by_location->get_posts(array(
                'post_type' => 'bar',
                'status' => 'publish',
                'numberposts' => -1
            ));

            foreach ($bars as $bar) {
                $displaylist .= '<p class="bar-list-item"><a href="' . $bar->post_name . '"/>' . $bar->post_title . '</a></p>';
            }
        }

    $displaylist .= '</div>';

    return $displaylist;
}
 add_shortcode( 'bar_location_list', 'dwwp_bar_location_list');
