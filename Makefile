.PHONY : all
all : airports locales build

.PHONY : build
build : clean bundle/data
	webpack -p

.PHONY : fix
fix :
	prettier --write .
	eslint --fix .

.PHONY : locales airports
locales :
	node scripts/locales
airports data/airports.json :
	node scripts/airports > data/airports.json
	ls -lAh data/airports.json

bundle/data : bundle/data/airports.json bundle/data/GeoLite2-Country.mmdb
bundle/data/airports.json : data/airports.json
	mkdir -p `dirname $@`
	jq -c . < $^ > $@
bundle/data/GeoLite2-Country.mmdb : data/maxmind/GeoLite2-Country.mmdb
	mkdir -p `dirname $@`
	cp $^ $@

data : data/maxmind/GeoLite2-Country.mmdb
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
	- rm -rf coverage bundle/fonts
	- rm -f bundle/*.hot-update.json bundle/manifest.json bundle/*.css bundle/*.js bundle/popup.html
pristine : clean
	- jest --clearCache
	- rm -rf bundle/data node_modules data/maxmind

.PHONY : ci codecov coveralls codeclimate
codecov :
	codecov --disable=gcov
coveralls :
	coveralls < coverage/lcov.info
codeclimate :
	codeclimate-test-reporter < coverage/lcov.info
ci : codecov coveralls codeclimate
	npm outdated
	ls -lAh bundle/*
