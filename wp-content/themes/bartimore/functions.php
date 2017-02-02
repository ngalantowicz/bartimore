<?php
function elh_insert_into_db() {

    global $wpdb;
    // creates baltimore_boundaries in database if not exists
    $table = $wpdb->prefix . "baltimore_boundaries";
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS $table (
        `id` mediumint(9) NOT NULL AUTO_INCREMENT,
        `name` text NOT NULL,
        `coordinates` text NOT NULL,
    UNIQUE (`id`)
    ) $charset_collate;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
    // starts output buffering
    ob_start();
    ?>
    <form action="#v_form" method="post" id="v_form">
        <label for="boundary_name"><h3>Hello there! What is your name?</h3></label>
        <input type="text" name="boundary_name" id="boundary_name" placeholder="name"/>
        <input type="text" name="boundary_coordinates" id="boundary_coordinates" placeholder="coordinates"/>
        <input type="submit" name="submit_form" value="submit" />
    </form>
    <?php
    $html = ob_get_clean();
    // does the inserting, in case the form is filled and submitted
    if ( isset( $_POST["submit_form"] ) && $_POST["boundary_name"] != "" ) {
        $table = $wpdb->prefix."baltimore_boundaries";
        $name = strip_tags($_POST["boundary_name"], "");
        $coordinates = strip_tags($_POST["boundary_coordinates"], "");
        $wpdb->insert(
            $table,
            array(
                'name' => $name,
                'coordinates' => $coordinates
            )
        );
        $html = "<p>Your name <strong>$name</strong> was successfully recorded. Thanks!!</p>";
    }
    // if the form is submitted but the name is empty
    if ( isset( $_POST["submit_form"] ) && $_POST["boundary_name"] == "" )
        $html .= "<p>You need to fill the required fields.</p>";
    // outputs everything
    return $html;

    if ( isset( $_POST["submit_form"] ) && $_POST["boundary_coordinates"] == "" )
        $html .= "<p>You need to fill the required fields.</p>";
    // outputs everything
    return $html;
}

// adds a shortcode you can use: [insert-into-db]
add_shortcode('insert-into-db', 'elh_insert_into_db');

function get_baltimore_boundary_data() {

    global $wpdb;
    $result = $wpdb->get_results( "SELECT * FROM wp_baltimore_boundaries");
    return json_encode($result);
}

function get_bar_coordinates() {


    $posts = get_posts(array(
        'post_type' => 'bar'
    ));
    $result = get_post_meta( $posts[0]->ID );
    return json_encode($result);

}



// Register the script
wp_register_script( 'baltimore_map', get_stylesheet_directory_uri().'/js/map.js' );

// Localize the script with new data
$translation_array = get_baltimore_boundary_data();
$bar_array = get_bar_coordinates();

wp_localize_script( 'baltimore_map', 'baltimoreBoundaries', $translation_array );
wp_localize_script( 'baltimore_map', 'baltimoreBars', $bar_array );

// Enqueued script with localized data.
wp_enqueue_script( 'baltimore_map');
wp_enqueue_script( 'openLayers', get_stylesheet_directory_uri() .'/js/ol.js');

//Add openLayers Styles
wp_enqueue_style( 'bartimore', get_stylesheet_directory_uri().'/css/ol.css' );
