image_repo:= ling1ming/cs410:latest
image_name := ling1ming/cs410  
image_tag := latest 

.IGNORE: kill stop

make:
	nodemon server.js

install:
	npm install

db:
	brew tap mongodb/brew
	brew install mongodb-community@4.2


docker:
	@echo "[INFO] Create docker image"
	@docker build -t $(image_name) -f Dockerfile ./


publish:
	@echo "[INFO] Publish docker image"
	@docker push $(image_repo)

host:stop
	@echo "[INFO] Hosting docker image"
	@docker run -it -p 8080:8080 \
	-e DB="" \
	--name $(image_name) $(image_tag)

kill:
	@echo "[INFO] Killing docker image"
	@docker kill $(image_tag)

stop: kill
	@echo "[INFO] Stopping docker image"
	@docker rm $(image_tag)