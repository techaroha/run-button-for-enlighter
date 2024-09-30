<?php
/*
Plugin Name: Run Button For Enlighter
Description: It is a powerful plugin designed specifically for the Enlighter - Customizable Syntax Highlighter WordPress plugin. It easily integrates with Enlighter, and it gives you a run functionality button on any program on your website.
Author URI: https://techaroha.com
Author: Manoj Kolhe
Version: 2.3
Requires PHP: 5.6
Plugin URI: https://github.com/techaroha/run-button-for-enlighter
License: GPL-2.0
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

if (!defined('ABSPATH'))
    exit; // Exit if accessed directly

function taenlighter_jscss_check()
{
    return file_exists(plugin_dir_path(__FILE__) . 'script-enlighter.js');
}


function taenlighter_add_api_key_to_header()
{
    // Retrieve the current API key stored in WordPress options.
    $current_api_key = get_option('taenlighter_default_api_key');
    // Check if the API key is not empty.
    if (!empty($current_api_key)) {
        // Output a JavaScript variable in the HTML <head> section with the API key.
        $script = 'var taenlighter_default_api_key = "' . esc_js($current_api_key) . '";';
        wp_add_inline_script('custom-plugin-script', $script);
    }
}

// Hook 'add_api_key_to_header' function to the 'wp_head' action.
add_action('wp_head', 'taenlighter_add_api_key_to_header');

function taenlighter_plugin_menus()
{
    // Add an options page with a title and capability requirements.
    add_options_page('Custom Plugin Settings', 'Enlighter – Extension With Run Button', 'manage_options', 'custom-plugin', 'taenlighter_plugin_pages');
}

// Hook 'taenlighter_plugin_menus' function to the 'admin_menu' action.
add_action('admin_menu', 'taenlighter_plugin_menus');

function taenlighter_plugin_activation_redirecto()
{
    if (is_admin() && get_option('taenlighter_activate_plugin')) {
        delete_option('taenlighter_activate_plugin');
        wp_safe_redirect(admin_url('options-general.php?page=custom-plugin'));
        exit();  // Terminate script execution to ensure the redirection takes effect.
    }
}

register_activation_hook(__FILE__, 'taenlighter_plugin_activation_redirecto');
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'taenlighter_plugin_settings_link');

function taenlighter_plugin_settings_link($links)
{
    $settings_link = '<a href="options-general.php?page=custom-plugin">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}

function taenlighter_plugin_pages()
{
    // Output HTML markup to create a page in the WordPress admin panel.
    echo '<div class="wrap">';
    echo '<h2>Enlighter – Extension With Run Button</h2>';

    // Check if the 'submit_api_key' form variable is set (indicating that the form has been submitted).
    if (isset($_POST['submit_api_key'])) {
        // Verify nonce
        if (isset($_POST['submit_api_key_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['submit_api_key_nonce'])), 'submit_api_key_nonce')) {
            // Sanitize and store the submitted API key in the WordPress options.
            $api_key = sanitize_text_field($_POST['taenlighter_default_api_key']);
            update_option('taenlighter_default_api_key', $api_key);
        } else {
            // Nonce verification failed, handle accordingly (e.g., show an error message).
            echo '<div class="error"><p>Security check failed. Please try again.</p></div>';
        }
    }

    // Retrieve the current API key from the WordPress options.
    $current_api_key = get_option('taenlighter_default_api_key', '');

    // Output a form for setting the Techaroha AI Online Compiler API Key.
    echo '<form method="post">';
    // Add nonce field
    wp_nonce_field('submit_api_key_nonce', 'submit_api_key_nonce');
    echo '<table class="form-table">';
    echo '<tr valign="top">';
    echo '<th scope="row">Techaroha AI Online Compiler API Key</th>';
    echo '<td><input type="text" name="taenlighter_default_api_key" value="' . esc_attr($current_api_key) . '" /></td>';
    echo '</tr>';
    echo '</table>';
    echo '<input type="submit" name="submit_api_key" value="Activate API Key" class="button-primary" />';
    echo '</form>';

    // Output information about the API key and status.
    echo '<ul class="status-list">';
    echo '<li>';
    echo '<p class="info">';
    echo '<b>API Key (Optional):</b> You can enter an API key here if you wish to enable the "Run Code" option with a different compiler powered by <a class="api-ref" style="color:blue;" href="https://techaroha.com/ai-compiler" target="_blank">Techaroha AI.</a> If no API key is provided, the code will be executed using the default Newtum API Compiler. Please note that if you enter an incorrect or invalid API key, it will result in an access error. Ensure the accuracy of your API key to ensure seamless code execution with your preferred compiler.';
    echo '</p>';
    echo '</li>';
    echo '<li>';
    echo '<img src="' . esc_url(plugins_url('./assets/images/status-icon.png', __FILE__)) . '" alt="Status Icon" class="status-ok">';
    echo esc_html__('Online Status', 'enlighter-extension-with-run-button') . ' - ' . esc_html__('OK', 'enlighter-extension-with-run-button');
    echo '</li>';
    echo '<li>';
    echo '<img src="' . esc_url(plugins_url('./assets/images/status-icon.png', __FILE__)) . '" alt="Status Icon" class="' . (taenlighter_jscss_check() ? 'status-ok' : 'status-not-ok') . '">';
    echo esc_html__('Javascript and CSS Working', 'enlighter-extension-with-run-button') . ' - ';
    echo taenlighter_jscss_check() ? esc_html__('OK', 'enlighter-extension-with-run-button') : esc_html__('Not Working', 'enlighter-extension-with-run-button');
    echo '</li>';
    echo '</ul>';
    echo '<img src="' . esc_url(plugins_url('./assets/images/info-icon.png', __FILE__)) . '" alt="Info Icon" class="info-icon">';
    echo '<p>The "RUN" button is now available on Enlighter consoles.</p>';
    echo '</div><br>';

}

function taenlighter_runbutton_enqueue_styles()
{
    wp_enqueue_style('enlighter-extension-style', plugins_url('./assets/css/style-enlighter.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'taenlighter_runbutton_enqueue_styles');

add_filter('script_loader_tag', 'taenlighter_add_nonce_to_script', 10, 2);

function taenlighter_add_nonce_to_script($tag, $handle) {
    if ('custom-plugin-script' === $handle) {
        return str_replace('src', 'nonce="' . wp_create_nonce('custom_nonce') . '" src', $tag);
    }
    return $tag;
}


function taenlighter_runbutton_enqueue_scripts()
{
    // Enqueue a JavaScript file named 'custom-plugin-script' for use on WordPress pages.
    wp_enqueue_script('custom-plugin-script', plugins_url('script-enlighter.js', __FILE__), array('jquery'), '1.0', true);
    // Add async attribute to the script
    wp_script_add_data('custom-plugin-script', 'async', true);
    
}

// Add an action hook to enqueue the custom script when 'wp_enqueue_scripts' is triggered.
add_action('wp_enqueue_scripts', 'taenlighter_runbutton_enqueue_scripts');
?>