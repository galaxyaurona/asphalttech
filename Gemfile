source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.4'


# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc
gem 'sprockets', '2.12.3'
gem 'angular-rails-templates'
gem 'angular_rails_csrf'
gem 'responders', '~> 2.0'
gem 'font-awesome-sass', '~> 4.5.0'
gem 'delayed_job_active_record' # for heroku specific
gem 'prawn'
gem 'prawn-table'
gem 'angular_ui_tree_rails'
gem 'wicked_pdf'
gem 'wkhtmltopdf-binary'
gem 'roo'
#scheduler for rails
#documentation https://github.com/javan/whenever
gem 'whenever', require: false

# test puma app, concurrent server
gem 'puma'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'capistrano', '~> 3.4.0'
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'
  gem 'sqlite3'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :production do

  gem 'ngannotate-rails'#auto annotate for minification purpose
  gem 'pg'
  gem 'rails_12factor'
end