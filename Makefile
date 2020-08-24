.PHONY : all
all : clean build

.PHONY : build
build : bundle/data
	webpack -p

.PHONY : prerequisites
prerequisites : data

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
	node scripts/airports.js $@
	ls -lAh $@

.PHONY : test
test :
	jest --coverage

.PHONY : clean
clean :
	- rm -rf coverage
	- rm -f bundle/*.hot-update.json bundle/manifest.json bundle/*.css bundle/*.js bundle/popup.html

.PHONY : pristine
pristine : clean
	- rm -rf node_modules bundle/data data
