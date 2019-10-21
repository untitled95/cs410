make:
	nodemon server.js

install:
	npm install

db:
	brew tap mongodb/brew
	brew install mongodb-community@4.2
	