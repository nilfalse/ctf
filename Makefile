.PHONY : all
all : clean build

.PHONY : build
build : locales bundle/data
	webpack -p

.PHONY : prerequisites
prerequisites : data locales

.PHONY : locales
locales :
	node scripts/locales

bundle/data : data
	- rm -rf $@
	cp -r $^ $@

data : data/GeoLite2-Country.mmdb data/airports.json
data/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -v "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh $@
data/airports.json :
	mkdir -p `dirname $@`
	node scripts/airports $@
	ls -lAh $@

.PHONY : fix
fix :
	prettier --write .
	eslint --fix .

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
	- rm -rf node_modules bundle/data data

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
