.PHONY : preview
preview : www
	(cd build && python3 -m http.server)

.PHONY : www
www : build
	yarn react-snap
.PHONY : cdn
cdn : deps build
	cp cdn_overrides/* build
.PHONY : build
build :
	SKIP_PREFLIGHT_CHECK=true PUBLIC_URL=https://ctf.pages.dev yarn react-scripts build

.PHONY : deps
deps : cdn_overrides/GeoLite2-Country.mmdb

cdn_overrides/GeoLite2-Country.mmdb : data/GeoLite2-Country.mmdb
	cp data/GeoLite2-Country.mmdb cdn_overrides/

data/GeoLite2-Country.mmdb :
	mkdir -p `dirname $@`
	curl -vL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | tar --strip-components 1 -xzv -C `dirname $@`
	ls -lAh `dirname $@`

.PHONY : clean
clean :
	- rm -rf build cdn_overrides/GeoLite2-Country.mmdb data
