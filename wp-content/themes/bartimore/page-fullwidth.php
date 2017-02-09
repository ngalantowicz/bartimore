<?php
/**
 * Template Name: Full-width (no sidebar)
 *
 * This is the template that displays full width page without sidebar
 *
 * @package Barletta
 */

get_header(); ?>

	<div id="primary" class="content-area">

		<main id="main" class="site-main" role="main">

			<?php while ( have_posts() ) : the_post(); ?>

                <?php

                    if (get_the_title() === "Posts" ) {
                        ?>
                        <h1 style="text-align: center; font-size: 38px; letter-spacing: -0.4px; margin-top: 1.5em; margin-bottom: 1em">Posts</h1>
                            <ul>
                        <?php
                            $bar_data = json_decode(get_bar_data());
                            foreach ($bar_data as $bar) {
                                ?>
                                <li><a href='/bartimore/bars/<?php echo $bar->bar_slug?>'><?php echo $bar->bar_name ?></a></li>
                                <?php
                            }
                            ?>
                            <ul>
                            <?php
                    }
                    else {
                         get_template_part( 'content', 'page' );
                    }
                ?>

					<?php
					// If comments are open or we have at least one comment, load up the comment template
					if ( get_theme_mod( 'barletta_page_comments' ) == 1 ) :
					if ( comments_open() || '0' != get_comments_number() ) :
					comments_template();
					endif;
					endif;
					?>

			<?php endwhile; // end of the loop. ?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_footer();
