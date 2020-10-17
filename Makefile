NODEJS=node --unhandled-rejections=strict --experimental-json-modules

.PHONY : all
all : airports locales
	$(MAKE) --no-print-directory build

.PHONY : build
build : bundle/data webpack

.PHONY : webpack
webpack : clean
	webpack

.PHONY : fix
fix :
	prettier --write .
	eslint --fix .

.PHONY : locales airports
locales : node_modules
	$(NODEJS) scripts/locales
airports : node_modules
	$(MAKE) --no-print-directory --always-make data/airports.json

bundle/data : bundle/data/GeoLite2-Country.mmdb bundle/data/airports.json
bundle/data/airports.json : data/airports.json
	mkdir -p `dirname $@`
	jq -c . < $^ > $@
bundle/data/GeoLite2-Country.mmdb : data/maxmind/GeoLite2-Country.mmdb
	mkdir -p `dirname $@`
	cp $^ $@

data : data/maxmind/GeoLite2-Country.mmdb
data/airports.json :
	$(NODEJS) scripts/airports > data/airports.json
	ls -lAh data/airports.json
data/maxmind/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -v "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh `dirname $@`

.PHONY : lint prettier eslint
lint : prettier eslint
prettier :
	prettier --check .
eslint :
	eslint .

.PHONY : test
test :
	jest --coverage

.PHONY : clean pristine
clean :
	- rm -rf bundle/hot coverage
	- rm -f bundle/manifest.json bundle/*.woff bundle/*.svg bundle/*.css bundle/*.js bundle/popup.html
pristine : clean
	- rm -f cc-test-reporter
	- jest --clearCache
	- rm -rf bundle/data node_modules data/maxmind

.PHONY : node_modules
node_modules :
	npm install

cc-test-reporter :
	curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > $@
	chmod +x $@
.PHONY : ci coveralls codecov codeclimate
coveralls :
	coveralls < coverage/lcov.info
codecov :
	codecov --disable=gcov
codeclimate : cc-test-reporter
	./cc-test-reporter after-build --exit-code $$TRAVIS_TEST_RESULT
ci : codecov coveralls codeclimate
	- npm outdated
	ls -lAhR bundle
