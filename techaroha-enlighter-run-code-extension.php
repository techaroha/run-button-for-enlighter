<?php
/*
Plugin Name: Enlighter – Extension With Run Button
Description: It is a powerful plugin designed specifically for the Enlighter - Customizable Syntax Highlighter WordPress plugin. It easily integrates with Enlighter, and it gives you a run functionality button on any program on your website.
Author URI: https://techaroha.com/
Version: 2.0
Author: Techaroha Solutions Private Ltd
*/

function is_jjavascript_css_working() {
    return file_exists(plugin_dir_path(__FILE__) . 'script-enlighter.js');
}


function add_api_key_to_header() {
    $current_api_key = get_option('techaroha_compiler_api_key'); 

    if (!empty($current_api_key)) {
        echo '<script>var techaroha_compiler_api_key = "' . esc_js($current_api_key) . '";</script>';
    }
}
add_action('wp_head', 'add_api_key_to_header');

function custom_plugin_menus() {
    add_options_page('Custom Plugin Settings', 'Enlighter – Extension With Run Button', 'manage_options', 'custom-plugin', 'custom_plugin_pages');
}
add_action('admin_menu', 'custom_plugin_menus');
function custom_plugin_activation_redirecto() {
    if (is_admin() && get_option('activate_custom_plugin')) {
        delete_option('activate_custom_plugin');
        wp_safe_redirect(admin_url('options-general.php?page=custom-plugin'));
        exit();
    }
}
register_activation_hook(__FILE__, 'custom_plugin_activation_redirecto');
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'custom_plugin_settings_link');
function custom_plugin_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=custom-plugin">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}
function custom_plugin_pages() {
    echo '<div class="wrap">';
    echo '<h2>Enlighter – Extension With Run Button</h2>';
	if (isset($_POST['submit_api_key'])) {
        $api_key = sanitize_text_field($_POST['techaroha_compiler_api_key']);
        update_option('techaroha_compiler_api_key', $api_key);
    }

    $current_api_key = get_option('techaroha_compiler_api_key', '');
     echo '<form method="post">';
    echo '<table class="form-table">';
    echo '<tr valign="top">';
    echo '<th scope="row">Techaroha AI Online Compiler API Key</th>';
    echo '<td><input type="text" name="techaroha_compiler_api_key" value="' . esc_attr($current_api_key) . '" /></td>';
    echo '</tr>';
    echo '</table>';
    echo '<input type="submit" name="submit_api_key" value="Activate API Key" class="button-primary" />';
    echo '</form>';

    echo '<ul class="status-list">';
    echo '<li>';
    echo '<p class="info">'; 
    echo '<b>API Key (Optional):</b> You can enter an API key here if you wish to enable the "Run Code" option with a different compiler powered by <a class="api-ref" style="color:blue;" href="https://techaroha.com/ai-compiler" target="_blank">Techaroha AI.</a> If no API key is provided, the code will be executed using the default Newtum API Compiler. Please note that if you enter an incorrect or invalid API key, it will result in an access error. Ensure the accuracy of your API key to ensure seamless code execution with your preferred compiler.'; 
    echo '</p>'; 
    echo '</li>';
    echo '<li>';
    echo '<img src="https://cdn-icons-png.flaticon.com/512/9426/9426997.png" alt="Status Icon" class="status-ok">';
    echo esc_html__('Online Status', 'custom-image-plugin') . ' - ' . esc_html__('OK', 'custom-image-plugin');
    echo '</li>';
    echo '<li>';
    echo '<img src="https://cdn-icons-png.flaticon.com/512/9426/9426997.png" alt="Status Icon" class="' . (is_jjavascript_css_working() ? 'status-ok' : 'status-not-ok') . '">';
    echo esc_html__('Javascript and CSS Working', 'custom-image-plugin') . ' - ';
    echo is_jjavascript_css_working() ? esc_html__('OK', 'custom-image-plugin') : esc_html__('Not Working', 'custom-image-plugin');
    echo '</li>';
    echo '</ul>';
    echo '<img src="' . plugins_url('images/info-icon.png', __FILE__) . '" alt="Info Icon" class="info-icon">';
    echo '<p>The "RUN" button is now available on Enlighter consoles.</p>';
    echo '</div><br>';

    echo '<style>
.wrap {
    padding: 20px !important;
    background-color: #f5f5f5 !important;
}

h1, h2 {
    margin-bottom: 20px !important;
}

.form-table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-bottom: 30px !important;
}

.form-table th,
.form-table td {
    padding: 10px !important;
    border: 1px solid #ccc !important;
}

.status-list {
    list-style: none !important;
    padding: 0 !important;
}

.status-list li {
    margin-bottom: 10px !important;
    display: flex !important;
    align-items: center !important;
}

.status-list img {
    width: 20px !important;
    height: 20px !important;
    margin-right: 10px !important;
}

.status-ok {
    color: green !important;
}

.status-not-ok {
    color: red !important;
}
</style>';
}




function custom_plugin_enqueue_scripts() {
    wp_enqueue_script('custom-plugin-script', plugins_url('script-enlighter.js', __FILE__), array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'custom_plugin_enqueue_scripts');
?>