.PHONY : prerequisites build

build : output/data
	webpack --production

prerequisites : data

output/data : data
	rm -rf $@
	cp -r $^ $@

data : data/GeoLite2-Country.mmdb data/airports.json

data/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -v "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh $@

data/airports.json :
	mkdir -p `dirname $@`
	node scripts/airports.js > $@
	ls -lAh $@

clean :
	- rm -rf output/data output/*.js data
