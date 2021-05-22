NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} node_modules/.bin/

.PHONY : all
all : build

.PHONY : firefox chromium
firefox : clean primary-deps
	yarn workspace firefox webpack serve
chromium : clean primary-deps
	yarn workspace chromium webpack serve

.PHONY : fix
fix :
	$(NODEJS_BIN)prettier --write .
	$(NODEJS_BIN)eslint --fix .

.PHONY : primary-deps
primary-deps : ensure-node-modules
	${MAKE} --directory=packages/bundle

.PHONY : test
test : primary-deps
	$(NODEJS_BIN)jest --coverage

.PHONY : clean pristine
clean :
	- rm -rf coverage
	$(MAKE) --directory=packages/firefox clean
	$(MAKE) --directory=packages/chromium clean
pristine : clean
	- $(NODEJS_BIN)jest --clearCache
	$(MAKE) --directory=packages/cdn clean
	$(MAKE) --directory=packages/landing clean
	${MAKE} --directory=packages/bundle pristine
	$(MAKE) --directory=packages/firefox pristine
	- rm -rf node_modules

node_modules : package.json
	yarn --frozen-lockfile
	touch node_modules
.PHONY : ensure-node-modules
ensure-node-modules :
	$(MAKE) --no-print-directory --always-make node_modules

.PHONY : lint prettier eslint
lint : prettier eslint
prettier :
	$(NODEJS_BIN)prettier --check .
eslint :
	$(NODEJS_BIN)eslint .

.PHONY : outdated build build.firefox build.chromium
outdated : primary-deps
	- yarn outdated
build : build.firefox build.chromium
build.firefox : node_modules primary-deps
	$(MAKE) --directory=packages/firefox bundle build
build.chromium : node_modules
	$(MAKE) --directory=packages/chromium build

packages/firefox/firefox.zip : node_modules
	$(MAKE) --directory=packages/firefox firefox.zip
packages/chromium/chromium.zip : node_modules
	$(MAKE) --directory=packages/chromium chromium.zip
