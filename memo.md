npx tailwindcss init
npx tailwindcss -c ./tailwind.config.js -i ./tailwindcss/style.css -o src/output.css
npx webpack --config webpack.config.js
npx webpack-dev-server