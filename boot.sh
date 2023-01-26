#!/bin/bash

# Check if Composer is installed
hash composer 2>/dev/null || {
  echo >&2 "Composer is not installed. Installing...";
  curl -sS https://getcomposer.org/installer | php;
  mv composer.phar /usr/local/bin/composer;
}

# Check if NPM is installed
hash npm 2>/dev/null || {
  echo >&2 "NPM is not installed. Installing...";
  curl -sL https://deb.nodesource.com/setup_14.x | bash -;
  apt-get install -y nodejs;
}

# Check if Sail is installed
hash sails 2>/dev/null || {
  echo >&2 "Sails is not installed. Installing...";
  npm install sails -g;
}

echo "All dependencies are installed."

# Run the application
sails lift

