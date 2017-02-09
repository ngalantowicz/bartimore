<?php

function dwwp_add_custom_metabox() {

    add_meta_box(
        'dwwp_meta',
        __( 'Bar Location' ),
        'dwwp_meta_callback',
        'bar'
    );
}

add_action('add_meta_boxes', 'dwwp_add_custom_metabox');


function dwwp_meta_callback( $post ) {
	wp_nonce_field( basename( __FILE__ ), 'dwwp_bar_nonce' );
	$dwwp_stored_meta = get_post_meta( $post->ID ); ?>

	<div>
		<div class="meta-row">
			<div class="meta-th">
				<label for="bar-id" class="dwwp-row-title"><?php _e( 'Bar Name', 'wp-bar-geo' ); ?></label>
			</div>
			<div class="meta-td">
				<input type="text" class="dwwp-row-content" name="bar_id" id="bar-id"
				value="<?php if ( ! empty ( $dwwp_stored_meta['bar_id'] ) ) {
					echo esc_attr( $dwwp_stored_meta['bar_id'][0] );
				} ?>"/>
			</div>
		</div>
		<div class="meta-row">
			<div class="meta-th">
				<label for="bar-coordinates" class="dwwp-row-title"><?php _e( 'Bar Coordinates', 'wp-bar-geo' ); ?></label>
			</div>
			<div class="meta-td">
				<input type="text" class="dwwp-row-content" name="bar_coordinates" id="bar-coordinates"
                value="<?php if ( ! empty ( $dwwp_stored_meta['bar_coordinates'] ) ) {
                    echo esc_attr( $dwwp_stored_meta['bar_coordinates'][0] );
                } ?>"/>
			</div>
		</div>
		<div class="meta">
			<div class="meta-th">
				<span><?php _e( 'Summary', 'wp-bar-geo' ) ?></span>
			</div>
		</div>
		<div class="meta-editor">
		<?php
		$content = get_post_meta( $post->ID, 'summary', true );
		$editor = 'summary';
		$settings = array(
			'textarea_rows' => 3,
			'media_buttons' => false,
		);
		wp_editor( $content, $editor, $settings); ?>
	</div>

	<?php
}

function dwwp_meta_save( $post_id ) {
	// Checks save status
    $is_autosave = wp_is_post_autosave( $post_id );
    $is_revision = wp_is_post_revision( $post_id );
    $is_valid_nonce = ( isset( $_POST[ 'dwwp_bar_nonce' ] ) && wp_verify_nonce( $_POST[ 'dwwp_bar_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';
    // Exits script depending on save status
    if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
        return;
    }
    if ( isset( $_POST[ 'bar_id' ] ) ) {
    	update_post_meta( $post_id, 'bar_id', sanitize_text_field( $_POST[ 'bar_id' ] ) );
    }
    if ( isset( $_POST[ 'bar_coordinates' ] ) ) {
    	update_post_meta( $post_id, 'bar_coordinates', sanitize_text_field( $_POST[ 'bar_coordinates' ] ) );
    }
    if ( isset( $_POST[ 'summary' ] ) ) {
    	update_post_meta( $post_id, 'summary', sanitize_text_field( $_POST[ 'summary' ] ) );
    }
}
add_action( 'save_post', 'dwwp_meta_save' );
