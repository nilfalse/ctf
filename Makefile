NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} node_modules/.bin/

.PHONY : all
all : primary-deps secondary-deps

.PHONY : firefox chromium
firefox : clean primary-deps
	yarn workspace firefox webpack serve
chromium : clean primary-deps
	yarn workspace chromium webpack serve

.PHONY : build.firefox build.chromium
build.firefox : clean primary-deps
	$(MAKE) --directory=packages/firefox bundle build
build.chromium : clean primary-deps
	yarn workspace chromium webpack

.PHONY : fix
fix :
	$(NODEJS_BIN)prettier --write .
	$(NODEJS_BIN)eslint --fix .

.PHONY : primary-deps secondary-deps
primary-deps : ensure-node-modules
	${MAKE} --directory=packages/bundle
secondary-deps : ensure-node-modules
	${MAKE} --directory=packages/bundle twemoji locales

.PHONY : lint prettier eslint
lint : prettier eslint
prettier :
	$(NODEJS_BIN)prettier --check .
eslint :
	$(NODEJS_BIN)eslint .

.PHONY : test
test :
	$(NODEJS_BIN)jest --coverage

.PHONY : clean pristine
clean :
	- rm -rf coverage packages/chromium/bundle/hot
	- rm -f packages/chromium/bundle/manifest.json packages/chromium/bundle/*.woff packages/chromium/bundle/*.svg packages/chromium/bundle/*.css packages/chromium/bundle/*.js packages/chromium/bundle/popup.html packages/chromium/bundle/options.html
	$(MAKE) --directory=packages/firefox clean
pristine : clean
	- rm -f cc-test-reporter
	- $(NODEJS_BIN)jest --clearCache
	${MAKE} --directory=packages/bundle pristine
	$(MAKE) --directory=packages/firefox pristine
	- rm -rf node_modules

node_modules : package.json
	yarn --frozen-lockfile || npm install --no-package-lock
	touch node_modules
.PHONY : ensure-node-modules
ensure-node-modules :
	$(MAKE) --no-print-directory --always-make node_modules

cc-test-reporter :
	curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > $@
	chmod +x $@
.PHONY : ci coveralls codecov codeclimate
coveralls :
	$(NODEJS_BIN)coveralls < coverage/lcov.info
codecov :
	$(NODEJS_BIN)codecov --disable=gcov
codeclimate : cc-test-reporter
	./cc-test-reporter after-build --exit-code $$TRAVIS_TEST_RESULT
ci : codecov coveralls codeclimate
	- npm outdated
	ls -lAhR bundle
