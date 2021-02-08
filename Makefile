NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} node_modules/.bin/

.PHONY : all
all : primary-deps secondary-deps

.PHONY : firefox chromium
firefox : clean primary-deps
	yarn workspace firefox webpack serve
chromium : clean primary-deps
	yarn workspace chromium webpack serve

.PHONY : fix
fix :
	$(NODEJS_BIN)prettier --write .
	$(NODEJS_BIN)eslint --fix .

.PHONY : primary-deps secondary-deps
primary-deps : ensure-node-modules
	${MAKE} --directory=packages/bundle
secondary-deps : ensure-node-modules
	${MAKE} --directory=packages/bundle twemoji locales

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

.PHONY : outdated ci ci.firefox ci.chromium
outdated : primary-deps
	- yarn outdated
release : release.firefox release.chromium
release.firefox : node_modules
	$(MAKE) --directory=packages/firefox firefox.release.zip
release.chromium : node_modules
	$(MAKE) --directory=packages/chromium chromium.release.zip
