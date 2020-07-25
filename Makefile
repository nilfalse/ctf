.PHONY : prerequisites build

build : output/data
	webpack --production

prerequisites : data

output/data : data
	cp -r data output/data

data : data/GeoLite2-Country.mmdb

data/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -v "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`

clean :
	- rm -rf output/data output/*.js data
