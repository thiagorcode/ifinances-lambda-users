.PHONY: build-CreateUserFunction build-FindByIdUserFunction build-LoginFunction build-AuthorizerFunction
.PHONY: build-RuntimeDependenciesLayer build-lambda-common 

build-CreateUserFunction:
	$(MAKE) HANDLER=src/handlers/create.ts build-lambda-common

build-FindByIdUserFunction:
	$(MAKE) HANDLER=src/handlers/findById.ts build-lambda-common

build-LoginFunction:
	$(MAKE) HANDLER=src/handlers/login.ts build-lambda-common

build-AuthorizerFunction:
	$(MAKE) HANDLER=src/handlers/authorizer.ts build-lambda-common

build-ResetPasswordUserFunction:
	$(MAKE) HANDLER=src/handlers/resetPassword.ts build-lambda-common
build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	HANDLER="${HANDLER}" node build.js
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --silent --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes aren't related to dependencies
	rm -rf "$(ARTIFACTS_DIR)/nodejs/node_modules/aws-sdk"

build-deploy-common:
	sam build -t services-users.yml
	cp -r ./samconfig.toml .aws-sam/build
	$(eval PARAMS := $(shell cat "params.$(env).json" | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]'))
	cd .aws-sam/build && sam deploy --on-failure DELETE --region sa-east-1 --parameter-overrides $(PARAMS) --config-env dev
