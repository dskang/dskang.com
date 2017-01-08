###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
page "/snake.html", layout: false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# Methods defined in the helpers block are available in templates
helpers do
  # Add 'active' class if link is to current page
  def nav_link_to(name, url)
    current = current_page.url == url || current_page.url == url + '/'
    class_name = current ? 'active' : ''

    link_to(name, url, class: class_name)
  end

  def full_image_url_for(path)
    host = "http://dskang.com"

    host + image_path(path)
  end
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

activate :blog do |blog|
  blog.sources = "blog/{year}/{title}.html"
  blog.permalink = "{title}.html"
  blog.layout = "blog-layout"
end

# Pretty URLs (Directory Indexes)
# e.g. /about instead of /about.html
activate :directory_indexes

# Build-specific configuration
configure :build do
  # Minify CSS on build
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :asset_hash

  # Use relative URLs for assets
  # activate :relative_assets

  # Use relative URLs for link helpers
  # set :relative_links, true

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.deploy_method = :git
end
