NODEJS=node --unhandled-rejections=strict --experimental-json-modules
NODEJS_BIN=${NODEJS} node_modules/.bin/

.PHONY : all
all : airports locales twemoji
	$(MAKE) --no-print-directory build

.PHONY : build
build : bundle/data webpack

.PHONY : webpack
webpack : clean
	$(NODEJS_BIN)webpack

.PHONY : fix
fix :
	$(NODEJS_BIN)prettier --write .
	$(NODEJS_BIN)eslint --fix .

.PHONY : locales airports
locales : ensure-deps
	${NODEJS} ./bin/locales.js
airports : ensure-deps
	$(MAKE) --no-print-directory --always-make data/airports.json

.PHONY : icons
icons : artwork/logo_icon.svg
	for i in 32 48 128 256 512; do inkscape -w $$i -h $$i $< --export-filename bundle/icons/icon_$${i}px.png; done

bundle/data : bundle/data/GeoLite2-Country.mmdb bundle/data/airports.json
bundle/data/airports.json : data/airports.json
	mkdir -p `dirname $@`
	jq -c . < $^ > $@
bundle/data/GeoLite2-Country.mmdb : data/maxmind/GeoLite2-Country.mmdb
	mkdir -p `dirname $@`
	cp $^ $@

data : data/maxmind/GeoLite2-Country.mmdb
data/airports.json :
	${NODEJS} ./bin/airports.js > data/airports.json
	ls -lAh data/airports.json
data/maxmind/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -vL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh `dirname $@`

.PHONY : twemoji
twemoji :
	- rm -rf bundle/assets/twemoji
	mkdir -p bundle/assets/twemoji
	time ${NODEJS} bin/twemoji.js
	ls -lA bundle/assets/twemoji

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
	- rm -rf bundle/hot coverage
	- rm -f bundle/manifest.json bundle/*.woff bundle/*.svg bundle/*.css bundle/*.js bundle/popup.html bundle/options.html
pristine : clean
	- rm -f cc-test-reporter
	- $(NODEJS_BIN)jest --clearCache
	- rm -rf bundle/data node_modules data/maxmind

node_modules : package.json
	yarn --frozen-lockfile || npm install --no-package-lock
	touch node_modules
.PHONY : ensure-deps
ensure-deps : node_modules

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
